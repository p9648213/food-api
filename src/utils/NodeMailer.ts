import nodeMailer from "nodemailer";
import { getEnvironmentVariables } from "../environments/environment";

export class NodeMailer {
  private static initiateTransport() {
    return nodeMailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: getEnvironmentVariables().gmail_auth.user,
        pass: getEnvironmentVariables().gmail_auth.pass,
      },
    });
  }

  static sendMail(data: {
    to: [string];
    subject: string;
    html: string;
  }): Promise<any> {
    return this.initiateTransport().sendMail({
      from: getEnvironmentVariables().gmail_auth.user,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}
