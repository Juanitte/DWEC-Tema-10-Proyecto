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

    constructor(role="User", isBanned=false, created=Date.now(), language=1, phoneNumber="", avatar="",bio="", userName="User", fullName="FullName", tag="@default", country=Country.UNDEFINED, email="example@example.com", password="") {
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