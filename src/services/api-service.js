const AUTH_URL = "https://localhost:7063/gateway/users/authenticate";
const USERS_URL = "https://localhost:7063/gateway/Users/users/";
const POSTS_URL = "https://localhost:7063/gateway/Posts/posts/";

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
            return data;
        });
}

export async function createUser(user) {
    return fetch(`${USERS_URL}create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
}