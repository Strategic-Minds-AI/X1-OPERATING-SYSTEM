import { NextResponse } from "next/server";
export async function GET(){
 return NextResponse.json({error:"X1_QUEUE_BRIDGE_NOT_CONNECTED",message:"Existing X1 staging queue is available. This route will remain disabled until the operator-approved auth, tenant mapping and approval broker are configured."},{status:503});
}
export async function POST(){
 return NextResponse.json({error:"X1_QUEUE_BRIDGE_NOT_CONNECTED",message:"No work has been dispatched. X1 workers must run only signed, approved and eligible work packets."},{status:503});
}
