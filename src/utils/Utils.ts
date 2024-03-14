export class Utils {
  public MAX_TOKEN_TIME = 5 * 60 * 1000;
  static generateVerificationToken(digit: number = 6) {
    let opt = "";
    for (let i = 0; i < digit; i++) {
      opt += Math.floor(Math.random() * 9) + 1;
    }
    return parseInt(opt);
  }
}
