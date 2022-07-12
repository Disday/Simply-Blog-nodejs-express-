export default class Post {
  static lastId = 0;

  constructor(title, body, author) {
    Post.lastId += 1;
    this.id = Post.lastId;
    this.title = title;
    this.body = body;
    this.author = author;
  }
}
