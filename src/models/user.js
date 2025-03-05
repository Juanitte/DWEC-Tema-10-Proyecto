export class User {
    id;
    userName;
    fullName;
    tag;
    country;
    created;
    email;
    avatar;

    constructor(id, userName, fullname, tag, country, created, email, avatar) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullname;
        this.tag = tag;
        this.country = country;
        this.created = created;
        this.email = email;
        this.avatar = avatar
    }
}