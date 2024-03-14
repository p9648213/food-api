import { NextFunction, Request, Response } from "express";
import { Utils } from "../utils/Utils";
import { NodeMailer } from "../utils/NodeMailer";
import User from "../model/User";

export class UserController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;
    const verification_token = Utils.generateVerificationToken(5);

    const data = {
      email,
      verification_token,
      verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
      phone,
      password,
      name,
      type,
      status,
    };

    try {
      let user = await new User(data).save();
      NodeMailer.sendMail({
        to: [email],
        subject: "Verify your email",
        html: `<p>Your Otp is ${verification_token}</p>`,
      });
      res.send(user);
    } catch (error) {
      next(error);
    }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    const verification_token = req.body.verification_token;
    const email = req.body.email;
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          verification_token: verification_token,
          verification_token_time: {
            $gt: Date.now(),
          },
        },
        {
          email_verified: true,
        },
        {
          new: true,
        }
      );

      if (user) {
        res.send(user);
      } else {
        throw new Error(
          "Email Verification Token Is Expired. Please try again."
        );
      }
    } catch (error) {
      next(error);
    }
  }
  static async resendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const email = req.query.email;
    const verification_token = Utils.generateVerificationToken(5);
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );

      if (user) {
        NodeMailer.sendMail({
          to: [user.email],
          subject: "Resend email verification",
          html: `<p>Your Otp is ${verification_token}</p>`,
        });
        res.json({
          success: true,
        });
      } else {
        throw new Error("User doesn't exist.");
      }
    } catch (error) {
      next(error);
    }
  }
}
