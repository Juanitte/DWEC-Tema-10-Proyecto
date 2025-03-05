export class CreatePostDto {
    author;
    authorTag;
    authorAvatar;
    content;
    attachments;
    userId;
    postId;

    constructor(author, authorTag, authorAvatar, content, attachments, userId, postId=0) {
        this.author = author;
        this.authorTag = authorTag;
        this.authorAvatar = authorAvatar;
        this.content = content;
        this.attachments = attachments;
        this.userId = userId;
        this.postId = postId;
    }
}