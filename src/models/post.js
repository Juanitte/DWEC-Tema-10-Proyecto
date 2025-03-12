export class Post {
    id;
    author;
    authorTag;
    authorAvatar;
    content;
    attachments;
    created;
    lastEdited;
    userId;
    postId;

    constructor(id, author, authorTag, content, attachments=[], created, lastEdited, userId, postId=0) {
        this.id = id;
        this.author = author;
        this.authorTag = authorTag;
        this.content = content;
        this.attachments = attachments;
        this.created = created;
        this.lastEdited = lastEdited;
        this.userId = userId;
        this.postId = postId;
    }
}