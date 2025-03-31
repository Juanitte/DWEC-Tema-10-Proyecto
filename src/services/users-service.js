import { Navigate } from "react-router-dom";
import { User } from "../models/user";
import { AUTH_URL, USERS_URL } from "../utils/literals";

export async function login(email, password) {
    return fetch(AUTH_URL, {
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
                localStorage.setItem("token", data.token);
            }
            let user = new User(data.userId, data.userName, data.fullName, data.tag, data.country, data.created, data.email, data.avatar);
            localStorage.setItem("user", JSON.stringify(user));
            return data;
        });
}

export async function verifySession(token) {
    try {
        const response = await fetch(`${AUTH_URL}/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");

          return false;
        }
    
        const data = await response.json();
    
        if (!data.UserId) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");

          return false;
        }
    
        localStorage.setItem("user", JSON.stringify(data));
    
        return data;

      } catch (error) {
        console.error("Error al verificar el token:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        return false;
      }
}

export async function createUser(userDto) {
    return fetch(`${USERS_URL}create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userDto),
    });
}

export async function getUserById(userId) {
    return fetch(`${USERS_URL}getbyid/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function follow(userId, followerId) {
    return fetch(`${USERS_URL}followuser/${userId}/${followerId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function unfollow(userId, followerId) {
    return fetch(`${USERS_URL}unfollow/${userId}/${followerId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getFollowers(userId) {
    return fetch(`${USERS_URL}getfollowers/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getFollowing(userId) {
    return fetch(`${USERS_URL}getfollowing/${userId}`, {
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