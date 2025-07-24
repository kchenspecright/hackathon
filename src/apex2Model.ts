import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config(); // load environment variables from .env
const LLM_MODEL = "claude-sonnet-4-20250514"; // Default model
const apexClass = `
/** * @description This class is a wrapper for the Custom Supersede Default Field settings. The Custom Supersede Default Field settings allow you to set a default value for a field when a record is superseded/versioned. This default value can either be applied to the "Old Record" (the record being superseded) or the "New Record" (the record being created). The default value is applied to records that match the object API name and one of the record type API names. */
public with sharing
class CustomSupersedeDefaultFieldWrapper extends SettingWrapper {
    /**	 * @description This boolean indicates whether or not to use the same name for the new record as the original record.	 */	@AuraEnabled public Boolean copyName
    {		get {			return (Boolean) get('copyName');		}		set {			put('copyName', value);		}	}
    /**	 * @description This string is the default value to set the field to on the target record.	 */	@AuraEnabled public String defaultFieldValue
    {		get {			return (String) get('defaultFieldValue');		}		set {			put('defaultFieldValue', value);		}	}
    /**	 * @description This string is the API name of the field to set to the default value.	 */	@AuraEnabled public String fieldApiName
    {		get {			return (String) get('fieldApiName');		}		set {			put('fieldApiName', value);		}	}
    /**	 * @description This boolean indicates whether or not the setting is active. This should be true by default.	 */	@AuraEnabled public Boolean isActive
    {		get {			return (Boolean) get('isActive');		}		set {			put('isActive', value);		}	}
    /**	 * @description This string is the API name of the object that the field resides on.	 */	@AuraEnabled public String objectApiName
    {		get {			return (String) get('objectApiName');		}		set {			put('objectApiName', value);		}	}
    /**	 * @description This string is a semicolon-separated list of record type API names that default value applies to. We only apply the default value to records that match the object API name and one of the record type API names.	 */	@AuraEnabled public String recordTypeApiName
    {		get {			return (String) get('recordTypeApiName');		}		set {			put('recordTypeApiName', value);		}	}
    /**	 * @description This string defines the target record to apply the default field value to. The only possible values are 'New Record' or 'Old Record'. Old Record is the record that is being superseded, and New Record is the record that is being created. If this is not set, it defaults to 'New Record'.	 */	@AuraEnabled public String targetRecord
    {		get {			return (String) get('targetRecord');		}		set {			put('targetRecord', value);		}	}
    public override Map<String, String> mapOfLegacyFieldsToWrapperFields() {		return new Map<String, String>{			'specright__copy_name__c' => 'copyName',			'specright__default_field_value__c' => 'defaultFieldValue',			'specright__field_api_name__c' => 'fieldApiName',			'specright__is_active__c' => 'isActive',			'specright__object_api_name__c' => 'objectApiName',			'specright__record_type_api_names__c' => 'recordTypeApiName',			'specright__target_record__c' => 'targetRecord'		};	}

    protected override SObject

    getEmptylegacySObject() {		return new specright__Custom_Supersede_Default_Field_Values__c();	}
}`;

export async function getModel() {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  const response = await anthropic.messages.create({
    model: LLM_MODEL,
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `I want you to look at this following Apex class, and 
        return in JSON dictionary that can be understood as a LLM tool input schema.  
        Below is the data:\n\n" +
          ${apexClass}`,
      },
    ],
  });
  const content = response.content[0];
  if (content && content.type === "text") {
    console.log("\x1b[32m%s\x1b[0m", content.text);
  }
}

getModel().catch((error) => {
  console.error("Error fetching model:", error);
});