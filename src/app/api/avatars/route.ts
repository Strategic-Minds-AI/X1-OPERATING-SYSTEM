import { NextResponse } from "next/server";
export async function GET() {
 return NextResponse.json({error:"AVATAR_BACKEND_NOT_CONNECTED",message:"This interface is a nonproduction prototype. Connect Supabase Auth and tenant-scoped APIs before reading or storing identities."},{status:503,headers:{"Cache-Control":"no-store"}});
}
export async function POST() {
 return NextResponse.json({error:"AVATAR_ENROLLMENT_DISABLED",message:"Consent, rights verification, authenticated storage and the avatar model pipeline are required before enrollment."},{status:503});
}
