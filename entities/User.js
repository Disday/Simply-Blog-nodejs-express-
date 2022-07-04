export default class User {
  constructor(nickname, passwordDigest) {
    this.guest = false;
    this.nickname = nickname;
    this.passwordDigest = passwordDigest;
  }

  isGuest = () => this.guest;
}
