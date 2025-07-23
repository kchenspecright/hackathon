export type Field = {
    name: string;
    value: string;
}
export type Setting = {
  setting_type: string;
  recordType: string;
  fields: Field[];
};

const settings: Setting[] = [];
export function getSetting(setting_type: string, recordType: string): Field[] | undefined {
  const setting = settings.find(s => s.setting_type === setting_type && s.recordType === recordType);
  return setting ? setting.fields : undefined;
}
export function setSetting(setting_type: string, recordType: string, fields: Field[]): void {
  const existingIndex = settings.findIndex(s => s.recordType === recordType && s.setting_type === setting_type);
  if (existingIndex >= 0) {
    settings[existingIndex].fields = fields;
  } else {
    settings.push({ setting_type, recordType, fields });
  }
}
export function listSettings(): Setting[] {
  return settings;
}