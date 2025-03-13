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
    isBanned;
    role;

    constructor(tag, bio, avatar, userName, fullName, country, email, password, phoneNumber, language=1,  isBanned=false, role="USER") {
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
        this.isBanned = isBanned;
        this.role = role;
    }
}