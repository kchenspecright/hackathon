export type Field = {
  name: string;
  value: string;
};
export type Setting = {
  setting_type: string;
  recordType: string;
  fields: Field[];
};

const settings: Setting[] = [];
export function getSetting(
  setting_type: string,
  recordType: string
): Field[] | undefined {
  const setting = settings.find(
    (s) => s.setting_type === setting_type && s.recordType === recordType
  );
  const SFJson = [
    {
      wrapperTypeName:
        setting_type === "custom supersede"
          ? "CustomSupersedeDefaultFieldWrapper"
          : "DynamicCloneDefaultFieldWrapper",
      wrapperTypeLabel:  setting_type === "custom supersede" ? "Custom Supersede Default Field Values" : "Dynamic Clone Default Field Values",
      name: "Specification Status  - New Record",
      masterLabel: null,
      isCustomSettingType: true,
      developerName: null,
      targetRecord: "New Record",
      recordTypeApiName: recordType,
      objectApiName: "specright__Specification__c",
      isActive: true,
      fieldApiName:  "specright__Status__c",
      defaultFieldValue: "New",
      copyName: false,
    },
  ];

  console.log("SFJson", SFJson);
  return setting ? setting.fields : undefined;
}
export function setSetting(
  setting_type: string,
  recordType: string,
  fields: Field[]
): void {
  const existingIndex = settings.findIndex(
    (s) => s.recordType === recordType && s.setting_type === setting_type
  );
  if (existingIndex >= 0) {
    settings[existingIndex].fields = fields;
  } else {
    settings.push({ setting_type, recordType, fields });
  }
}
export function listSettings(): Setting[] {
  return settings;
}

export function getSpecification(specificationId: string) {
  return {
    id: specificationId,
    name: "Sample Specification",
    description: "This is a sample specification for demonstration purposes.",
    record_type: "pallet",
    status: "approved",
  };
}
export function createSpecification(data: {
  name: string;
  description: string;
  status: string;
}) {
  console.log("Creating specification with data:", data);
}
