import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  cc = "saifm9189@gmail.com",
  subject,
  content,
  attachments = []
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: "saifmuhamed1828@gmail.com",
      pass: "swstticssrxgquzo", 
    },
  });

  const info = await transporter.sendMail({
    from: '"My App" <saifmuhamed1828@gmail.com>',
    to,
    cc,
    subject,
    html: content,
    attachments,
  });

  console.log("Email sent:", info.messageId);
  return info;
};
import { EventEmitter } from "node:events";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", (args) => {
  console.log("the sending email event is done");
  console.log(args);
});
  