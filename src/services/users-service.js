import {
    Navigate
} from "react-router-dom";
import {
    User
} from "../models/user";
import {
    AUTH_URL,
    BASE_URL,
    USERS_URL
} from "../utils/literals";
import {
    handleStorageChange
} from "../utils/utils";



export async function login(email, password) {
    return fetch(BASE_URL + AUTH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.token) {
                window.removeEventListener("storage", handleStorageChange);

                localStorage.setItem("token", data.token);
                let user = new User(data.userId, data.userName, data.fullName, data.tag, data.country, data.created, data.email, data.avatar);
                localStorage.setItem("user", JSON.stringify(user));

                window.addEventListener("storage", handleStorageChange);

                return data;
            }
        });
}

export async function createUser(userDto) {
    return fetch(`${BASE_URL}${USERS_URL}create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userDto),
    });
}

export async function getUserById(userId) {
    return fetch(`${BASE_URL}${USERS_URL}getbyid/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function follow(userId, followerId) {
    return fetch(`${BASE_URL}${USERS_URL}followuser/${userId}/${followerId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function unfollow(userId, followerId) {
    return fetch(`${BASE_URL}${USERS_URL}unfollow/${userId}/${followerId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getFollowers(userId) {
    return fetch(`${BASE_URL}${USERS_URL}getfollowers/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getFollowersPage(userId, page) {
    return fetch(`${BASE_URL}${USERS_URL}getfollowers/${userId}/${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getFollowing(userId) {
    return fetch(`${BASE_URL}${USERS_URL}getfollowing/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getFollowingPage(userId, page) {
    return fetch(`${BASE_URL}${USERS_URL}getfollowing/${userId}/${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export function handleInvalidToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    Navigate("/");
}