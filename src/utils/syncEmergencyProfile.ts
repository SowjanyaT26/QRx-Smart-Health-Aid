import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import type { HealthProfile } from "../types/HealthProfile";

interface PrivacySettings {
  showBloodGroup: boolean;
  showAllergies: boolean;
  showMedicalConditions: boolean;
  showMedications: boolean;
  showEmergencyContact: boolean;
}

const defaultPrivacySettings: PrivacySettings = {
  showBloodGroup: true,
  showAllergies: true,
  showMedicalConditions: true,
  showMedications: true,
  showEmergencyContact: true,
};

export async function syncEmergencyProfile(
  userId: string
) {
  // Get private health profile

  const healthSnapshot = await getDoc(
    doc(db, "healthProfiles", userId)
  );

  if (!healthSnapshot.exists()) {
    return;
  }

  const healthData =
    healthSnapshot.data() as HealthProfile;

  // Get privacy settings

  const privacySnapshot = await getDoc(
    doc(db, "privacySettings", userId)
  );

  const privacySettings: PrivacySettings =
    privacySnapshot.exists()
      ? {
          ...defaultPrivacySettings,
          ...(privacySnapshot.data() as PrivacySettings),
        }
      : defaultPrivacySettings;

  // Get or create permanent emergency profile ID

  const userRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userRef);

  let emergencyProfileId =
    userSnapshot.data()?.emergencyProfileId;

  if (!emergencyProfileId) {
    emergencyProfileId = crypto.randomUUID();

    await setDoc(
      userRef,
      {
        emergencyProfileId,
      },
      {
        merge: true,
      }
    );
  }

  // Build public data based on privacy settings

  const existingEmergencySnapshot = await getDoc(
  doc(
    db,
    "emergencyProfiles",
    emergencyProfileId
  )
);

const existingIsActive =
  existingEmergencySnapshot.exists()
    ? existingEmergencySnapshot.data().isActive !== false
    : true;

const publicEmergencyData: Record<
  string,
  unknown
> = {
  ownerId: userId,
  fullName: healthData.fullName || "",
  isActive: existingIsActive,
  updatedAt: serverTimestamp(),
};

  if (privacySettings.showBloodGroup) {
    publicEmergencyData.bloodGroup =
      healthData.bloodGroup || "";
  }

  if (privacySettings.showAllergies) {
    publicEmergencyData.allergies =
      healthData.allergies || "Not provided";
  }

  if (
    privacySettings.showMedicalConditions
  ) {
    publicEmergencyData.medicalConditions =
      healthData.medicalConditions ||
      "Not provided";
  }

  if (privacySettings.showMedications) {
    publicEmergencyData.medications =
      healthData.medications ||
      "Not provided";
  }

  if (
    privacySettings.showEmergencyContact
  ) {
    publicEmergencyData.emergencyContactName =
      healthData.emergencyContactName || "";

    publicEmergencyData.emergencyContactRelation =
      healthData.emergencyContactRelation || "";

    publicEmergencyData.emergencyContactPhone =
      healthData.emergencyContactPhone || "";
  }

  // Replace the complete public document

  await setDoc(
    doc(
      db,
      "emergencyProfiles",
      emergencyProfileId
    ),
    publicEmergencyData
  );

  return emergencyProfileId;
}