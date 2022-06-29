export default class User {
  constructor (name, passwordDigest) {
    this.guest = false;
    this.name = name;
    this.passwordDigest = passwordDigest;
  }

  isGuest = () => this.guest;
}