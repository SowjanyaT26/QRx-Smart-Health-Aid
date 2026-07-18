import type { HealthProfile } from "../types/HealthProfile";

interface ProfileCompletionResult {
  percentage: number;
  completedFields: number;
  totalFields: number;
  missingFields: string[];
}

export function calculateProfileCompletion(
  profile: HealthProfile
): ProfileCompletionResult {
  const fields = [
    {
      label: "Full Name",
      value: profile.fullName,
    },
    {
      label: "Blood Group",
      value: profile.bloodGroup,
    },
    {
      label: "Allergies",
      value: profile.allergies,
    },
    {
      label: "Medical Conditions",
      value: profile.medicalConditions,
    },
    {
      label: "Medications",
      value: profile.medications,
    },
    {
      label: "Emergency Contact Name",
      value: profile.emergencyContactName,
    },
    {
      label: "Emergency Contact Relationship",
      value: profile.emergencyContactRelation,
    },
    {
      label: "Emergency Contact Phone",
      value: profile.emergencyContactPhone,
    },
  ];

  const completedFields = fields.filter(
    (field) =>
      field.value &&
      field.value.trim() !== ""
  ).length;

  const missingFields = fields
    .filter(
      (field) =>
        !field.value ||
        field.value.trim() === ""
    )
    .map((field) => field.label);

  const percentage = Math.round(
    (completedFields / fields.length) * 100
  );

  return {
    percentage,
    completedFields,
    totalFields: fields.length,
    missingFields,
  };
}