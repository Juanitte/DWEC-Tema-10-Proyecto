import { User } from "../models/user";

const AUTH_URL = "https://localhost:7058/gateway/users/authenticate";
const USERS_URL = "https://localhost:7058/gateway/Users/users/";
const POSTS_URL = "https://localhost:7058/gateway/Posts/posts/";

export async function login(email, password) {
    return fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            let user = new User(data.userId, data.userName, data.fullName, data.tag, data.country, data.email, data.password);
            localStorage.setItem("user", JSON.stringify(user));
            return data;
        });
}

export async function createUser(userDto) {
    console.log(JSON.stringify(userDto));
    return fetch(`${USERS_URL}create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDto),
    });
}