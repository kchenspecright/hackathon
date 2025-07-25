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
   const SFJson = [
    {
      wrapperTypeName:
        setting_type === "custom supersede"
          ? "CustomSupersedeDefaultFieldWrapper"
          : "DynamicCloneDefaultFieldsWrapper",
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

  console.log("SFJson", JSON.stringify(SFJson, null, 2));
}
export function listSettings(): Setting[] {
  return settings;
}

export type Specification = {
  id?: string;
  name: string;
  description: string;
  record_type: string;
  status: string;
};

const specifications: Specification[] = [];
export function listSpecifications(): Specification[] {
  return specifications;
}

export function getSpecification(specificationId: string) {
  return specifications.find(
    (spec) => spec.id === specificationId
  );
}
export function createSpecification(data: Specification) {
  const newSpecification = {
    id: "SPEC-" + (specifications.length + 1).toString(),
    name: data.name,
    description: data.description,
    record_type: data.record_type,
    status: data.status,
  };
  specifications.push(newSpecification);
  return newSpecification;
}
