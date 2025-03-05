export class Post {
    id;
    author;
    authorTag;
    authorAvatar;
    content;
    created;
    lastEdited;
    userId;
    postId;

    constructor(id, author, authorTag, content, created, lastEdited, userId, postId=0) {
        this.id = id;
        this.author = author;
        this.authorTag = authorTag;
        this.content = content;
        this.created = created;
        this.lastEdited = lastEdited;
        this.userId = userId;
        this.postId = postId;
    }
}