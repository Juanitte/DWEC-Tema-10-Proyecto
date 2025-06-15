import { BASE_URL, POSTS_URL } from "../utils/literals";
import { handleInvalidToken } from "./users-service";

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

export async function getPostsByUser(userId, page, areComments = false) {
    return fetch(`${BASE_URL}${POSTS_URL}getbyuser/${userId}/${page}?areComments=${areComments}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

/**
 * @param {string} searchString  texto a buscar
 * @param {number} page          número de página
 * @param {boolean} byDate       ordenar por fecha
 * @param {string} propertyName  nombre de la propiedad, p.ej. "Content"
 * @param {string} filterType    tipo de filtrado (contains, equals, etc.)
 */
export async function getPostsFilter(
  searchString,
  page,
  byDate       = true,
  propertyName = 'Content',
  filterType   = 'contains'
) {
  const params = new URLSearchParams({
    SearchString: searchString,
    ByDate:       byDate.toString(),
    PropertyName: propertyName,
    FilterType:   filterType
  });

  const url = `${BASE_URL}${POSTS_URL}getallfilter/${page}?${params}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!res.ok) {
    if (res.status === 401) {
      handleInvalidToken();
      return;
    }
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }

  return res;
}

export async function getLikedPosts(userId, page) {
    return fetch(`${BASE_URL}${POSTS_URL}getliked/${userId}/${page}`, {
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

export async function getComments(postId, page) {
    return fetch(`${BASE_URL}${POSTS_URL}getcomments/${postId}/${page}`, {
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

export async function sharePost(userId, postId) {
    return fetch(`${BASE_URL}${POSTS_URL}share/${userId}/${postId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function stopSharingPost(userId, postId) {
    return fetch(`${BASE_URL}${POSTS_URL}stopsharing/${userId}/${postId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getSharedPosts(userId, page) {
    return fetch(`${BASE_URL}${POSTS_URL}getshared/${userId}/${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function postIsShared(userId, postId) {
    return fetch(`${BASE_URL}${POSTS_URL}postisshared/${userId}/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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

export async function getSavedPosts(userId, page) {
    return fetch(`${BASE_URL}${POSTS_URL}getsaved/${userId}/${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function savePost(userId, postId) {
    return fetch(`${BASE_URL}${POSTS_URL}save/${userId}/${postId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function stopSavingPost(userId, postId) {
    return fetch(`${BASE_URL}${POSTS_URL}stopsaving/${userId}/${postId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function postIsSaved(userId, postId) {
    return fetch(`${BASE_URL}${POSTS_URL}postissaved/${userId}/${postId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getSaveCount(postId) {
    return fetch(`${BASE_URL}${POSTS_URL}getsavecount/${postId}`, {
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

export async function hasNewComments(since, userId) {
    return fetch(`${BASE_URL}${POSTS_URL}hasnewcomments?since=${encodeURIComponent(since)}&userId=${userId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function hasNewShares(since, userId) {
    return fetch(`${BASE_URL}${POSTS_URL}hasnewshares?since=${encodeURIComponent(since)}&userId=${userId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function hasNewSaves(since, userId) {
    return fetch(`${BASE_URL}${POSTS_URL}hasnewsaves?since=${encodeURIComponent(since)}&userId=${userId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function hasNewLikes(since, userId) {
    return fetch(`${BASE_URL}${POSTS_URL}hasnewlikes?since=${encodeURIComponent(since)}&userId=${userId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getTopHashtags(hours, count = 10) {
    return fetch(`${BASE_URL}${POSTS_URL}gettophashtags?hours=${encodeURIComponent(hours)}&count=${count}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function getFeed(userId, page) {
    return fetch(`${BASE_URL}${POSTS_URL}getfeed/${userId}/${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export async function streamAttachment(attachmentId) {
  return fetch(
    `${BASE_URL}${POSTS_URL}streamattachment/${attachmentId}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
}