export function formatPostTime(time) {
    const postDate = new Date(time.split('.')[0] + 'Z');
    if (isNaN(postDate.getTime())) {
        console.error("Invalid date format:", time);
        return "Invalid date";
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) {
        if(diffInSeconds === 1) return `${diffInSeconds} second ago`;
        return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        if(diffInMinutes === 1) return `${diffInMinutes} minute ago`;
        return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        if(diffInHours === 1) return `${diffInHours} hour ago`;
        return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        if(diffInDays === 1) return `${diffInDays} day ago`;
        return `${diffInDays} days ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        if(diffInMonths === 1) return `${diffInMonths} month ago`;
        return `${diffInMonths} months ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    if(diffInYears === 1) return `${diffInYears} year ago`;
    return `${diffInYears} years ago`;
}

export const handleStorageChange = (event) => {
    if (event.key === "user" || event.key === "token") {
      window.location.reload();
    }
  };