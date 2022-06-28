export default class Post {
  static lastId = 0;

  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.id = String(Post.lastId + 1);
    Post.lastId = this.id;
  }
}