import { BASE_URL, POSTS_URL } from "../utils/literals";

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

    return fetch(`${BASE_URL}${POSTS_URL}create`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    });
}

export async function getPosts() {
    return fetch(`${BASE_URL}${POSTS_URL}getall`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getPostById(postId) {
    return fetch(`${BASE_URL}${POSTS_URL}getbyid/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getPostsByUser(userId, page) {
    return fetch(`${BASE_URL}${POSTS_URL}getbyuser/${userId}/${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getPostsFilter(searchString) {
    return fetch(`${BASE_URL}${POSTS_URL}getallfilter`, {
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

export async function getLikedPosts(userId, searchString) {
    return fetch(`${BASE_URL}${POSTS_URL}getliked/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getCommentCount(postId) {
    return fetch(`${BASE_URL}${POSTS_URL}getcommentcount/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getComments(postId) {
    return fetch(`${BASE_URL}${POSTS_URL}getcomments/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function likePost(userId, postId) {

    return fetch(`${BASE_URL}${POSTS_URL}like/${userId}/${postId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function postIsLiked(userId, postId) {
    return fetch(`${BASE_URL}${POSTS_URL}postIsLiked/${userId}/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getLikeCount(postId) {
    return fetch(`${BASE_URL}${POSTS_URL}getlikecount/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function dislikePost(userId, postId) {

    return fetch(`${BASE_URL}${POSTS_URL}dislike/${userId}/${postId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getShareCount(postId) {
    return fetch(`${BASE_URL}${POSTS_URL}getsharecount/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function hasNewPosts(since, userId, isProfile) {
    return fetch(`${BASE_URL}${POSTS_URL}hasnew?since=${encodeURIComponent(since)}&userId=${userId}&isProfile=${isProfile}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}