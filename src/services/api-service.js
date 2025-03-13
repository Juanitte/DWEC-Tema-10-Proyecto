import {
    Navigate
} from "react-router-dom";
import {
    User
} from "../models/user";

const AUTH_URL = "https://localhost:7058/gateway/users/authenticate";
const USERS_URL = "https://localhost:7058/gateway/Users/users/";
const POSTS_URL = "https://localhost:7058/gateway/posts/";

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
            console.log(data);
            let user = new User(data.userId, data.userName, data.fullName, data.tag, data.country, data.created, data.email, data.avatar);
            localStorage.setItem("user", JSON.stringify(user));
            return data;
        });
}

export async function createUser(userDto) {
    console.log(JSON.stringify(userDto));
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

export async function createPost(postDto) {
    const formData = new FormData();

    formData.append("author", postDto.author);
    formData.append("authorTag", postDto.authorTag);
    formData.append("authorAvatar", postDto.authorAvatar);
    formData.append("content", postDto.content);
    formData.append("userId", postDto.userId);
    formData.append("postId", postDto.postId);

    postDto.attachments.forEach((file) => {
        formData.append("attachments", file, file.name);
    });

    return fetch(`${POSTS_URL}create`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    });
}

export async function getPosts(userId, searchString, isForLikedPosts) {
    if(isForLikedPosts) {
        return fetch(`${POSTS_URL}getliked/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
    } else if (userId === 0) {
        if (searchString == "") {
            return fetch(`${POSTS_URL}getall`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
        } else {
            return fetch(`${POSTS_URL}getallfilter`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    "SearchString": searchString,
                    "ByDate": true,
                    "PropertyName": "Content"
                })
            });
        }
    } else {
        return fetch(`${POSTS_URL}getbyuser/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });
    }
}

export async function getPostById(postId) {
    return fetch(`${POSTS_URL}getbyid/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getCommentCount(postId) {
    return fetch(`${POSTS_URL}getcommentcount/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getComments(postId) {
    return fetch(`${POSTS_URL}getcomments/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function likePost(userId, postId) {

    return fetch(`${POSTS_URL}like/${userId}/${postId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function postIsLiked(userId, postId) {
    return fetch(`${POSTS_URL}postIsLiked/${userId}/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getLikeCount(postId) {
    return fetch(`${POSTS_URL}getlikecount/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function dislikePost(userId, postId) {

    return fetch(`${POSTS_URL}dislike/${userId}/${postId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getShareCount(postId) {
    return fetch(`${POSTS_URL}getsharecount/${postId}`, {
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