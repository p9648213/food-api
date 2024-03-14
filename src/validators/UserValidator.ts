import { body, query } from "express-validator";
import User from "../model/User";

export class UserValidators {
  static signup() {
    return [
      body("name", "Name is required").isString(),
      body("phone", "Phone number is required").isString(),
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                throw new Error("User Already Exist");
              } else {
                return true;
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body("password", "Password is required")
        .isAlphanumeric()
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must be between 8-25 characters"),
      body("type", "User role type is required").isString(),
      body("status", "User status is required").isString(),
    ];
  }

  static verifyUserEmail() {
    return [
      body(
        "verification_token",
        "Email verification token is required"
      ).isNumeric(),
      body("email", "Email is required").isEmail(),
    ];
  }

  static verifyUserforResendEmail() {
    return [query("email", "Email is required").isEmail()];
  }
}
