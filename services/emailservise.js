import nodemailer from "nodemailer";

const emailTransporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9f05b994f53386",
    pass: "52f3142fb0ae57",
  },
});

export { emailTransporter };
