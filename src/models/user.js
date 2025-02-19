export class User {
    id;
    username;
    fullName;
    tag;
    country;
    email;
    password;

    constructor(id=0, username="User", fullname="FullName", tag="@default", country="UNDEFINED", email="example@example.com", password="") {
        this.id = id;
        this.username = username;
        this.fullName = fullname;
        this.tag = tag;
        this.country = country;
        this.email = email;
        this.password = password;
    }
}