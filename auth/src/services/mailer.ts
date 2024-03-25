import sgMail from "@sendgrid/mail";

interface Payload {
  email: string;
  code: string;
}

const baseURL = {
  development: "http://labelled.dev",
  production: "https://www.labelled-eg.com",
}[process.env.ENVIRONMENT!];

const templateId = "d-8fa9b11afbe64caf974e10c0cfd1bcc5";

export const send = ({ email, code }: Payload) => {
  sgMail.setApiKey(process.env.SENDGRID_KEY!);
  return sgMail.send({
    from: "Labelled <admin@tazaker.org>",
    templateId,
    personalizations: [
      {
        to: email,
        dynamicTemplateData: {
          url: `${baseURL}/api/auth/complete?email=${email}&code=${code}`,
        },
      },
    ],
  });
};
