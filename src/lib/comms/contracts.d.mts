export type CommsAction = "inspect_connection" | "inspect_number" |
 "draft_sms" | "draft_mms" | "draft_voice_call" | "draft_whatsapp" |
 "draft_email" | "draft_campaign" | "draft_number_route" | "draft_eden_handoff";
export type CommsChannel = "sms" | "mms" | "voice" | "whatsapp" | "email" | "internal";
export type CommsProvider = "twilio" | "telnyx";
export type CommsDraftInput = {
 action:CommsAction; provider?:CommsProvider; number?:string; channel?:CommsChannel;
 to?:string; subject?:string; message?:string; media_urls?:string[];
 purpose?:string; consent_reference?:string; idempotency_key?:string; campaign_size?:number;
};
export type CommsDraftPacket = Readonly<{
 schema:string; source:string; donor:string; action:CommsAction; provider:CommsProvider;
 channel:CommsChannel; to:string|null; subject:string|null; message:string|null;
 media_urls:string[]; purpose:string|null; consent_reference:string|null;
 idempotency_key:string|null; campaign_size:number|null; source_number_suffix:string;
 status:"DRAFT_NOT_DISPATCHED"; action_class:"DRAFT_ONLY";
 customer_contact_allowed:false;billable_provider_actions:0;signed_queue_dispatched:false;
 approval_required:true;gates:string[];destination:string;persistence:"NONE";backend_runtime:string;
}>;
export type CommsInspectPacket = Readonly<{
 schema:string;action:"inspect_connection"|"inspect_number";provider:"twilio";
 number_suffix:"1174";scope:"READ_ONLY";
}>;
export declare const APPROVED_TWILIO_NUMBER:string;
export declare const COMMS_CHANNELS:readonly CommsChannel[];
export declare const COMMS_ACTIONS:readonly CommsAction[];
export declare const ACTION_CHANNELS:Readonly<Record<string,CommsChannel>>;
export declare const COMMS_FEATURES:readonly Readonly<{
 id:string;name:string;provider:string;state:string;
}>[];
export declare class CommsContractError extends Error{
 readonly code:string;constructor(code:string);
}
export declare function createCommsDraft(input:CommsDraftInput|unknown):CommsDraftPacket|CommsInspectPacket;
export declare function createCommsReadiness(flags?:{
 twilioConfigured?:boolean;telnyxConfigured?:boolean;queueConfigured?:boolean;
 aiGatewayConfigured?:boolean;gptTokenConfigured?:boolean;
}):{
 schema:string;service:string;stage:string;source_system:string;
 system_of_record:string;source_number_suffix:string;gpt_schema:string;
 provider_status:Record<string,string>;gpt_bridge:string;
 modules:typeof COMMS_FEATURES;live_send_allowed:false;production_ready:false;
 duplicate_worker_created:false;base44_runtime_dependency:false;
};
