import { Country } from "../utils/enums";

export class CreateUserDto {
    tag;
    bio;
    avatar;
    userName;
    fullName;
    country;
    email;
    password;
    phoneNumber;
    language;
    created;
    isBanned;
    role;

    constructor(tag="@default", bio="", avatar="", userName="User", fullName="FullName", country=196, email="example@example.com", password="", phoneNumber="", language=1, created=Date.now(), isBanned=false, role="USER") {
        this.userName = userName;
        this.fullName = fullName;
        this.tag = tag;
        this.country = country;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.avatar = avatar;
        this.phoneNumber = phoneNumber;
        this.language = language
        this.created = created;
        this.isBanned = isBanned;
        this.role = role;
    }
}