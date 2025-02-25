export class User {
    id;
    userName;
    fullName;
    tag;
    country;
    email;
    password;

    constructor(id=0, userName="User", fullname="FullName", tag="@default", country="UNDEFINED", email="example@example.com", password="") {
        this.id = id;
        this.userName = userName;
        this.fullName = fullname;
        this.tag = tag;
        this.country = country;
        this.email = email;
        this.password = password;
    }
}