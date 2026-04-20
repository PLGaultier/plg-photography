import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();
  await Contact.create({ name, email, message });

  await resend.emails.send({
    from: "PLG Photography <onboarding@resend.dev>",
    to: process.env.CONTACT_EMAIL!,
    subject: `New message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  return NextResponse.json({ success: true });
}
