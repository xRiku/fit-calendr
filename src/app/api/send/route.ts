import { EmailTemplate } from "@/components/email-template";
import { NextApiRequest } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextApiRequest) {
  try {
    const body = await new Response(req.body).json();
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [body.email],
      subject: "FitCalendr",
      react: EmailTemplate({
        code: body.otp,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
