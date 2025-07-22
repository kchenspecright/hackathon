export type Field = {
    name: string;
    value: string;
}
export type Setting = {
  recordType: string;
  fields: Field[];
};

const settings: Setting[] = [];
export function getSetting(recordType: string): Field[] | undefined {
  const setting = settings.find(s => s.recordType === recordType);
  return setting ? setting.fields : undefined;
}
export function setSetting(recordType: string, fields: Field[]): void {
  const existingIndex = settings.findIndex(s => s.recordType === recordType);
  if (existingIndex >= 0) {
    settings[existingIndex].fields = fields;
  } else {
    settings.push({ recordType, fields });
  }
}