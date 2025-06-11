import { Country } from "./enums";

export function formatPostTime(time) {
    const postDate = new Date(time.split('.')[0] + 'Z');
    if (isNaN(postDate.getTime())) {
        console.error("Invalid date format:", time);
        return "Invalid date";
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    const locale = localStorage.getItem("i18nextLng");

    if (diffInSeconds < 60) {
        if(locale === "es-ES"){
            if(diffInSeconds === 1) return `Hace ${diffInSeconds} segundo`;
            return `Hace ${diffInSeconds} segundos`;
        }
        if(locale == "en-GB"){
            if(diffInSeconds === 1) return `${diffInSeconds} second ago`;
            return `${diffInSeconds} seconds ago`;
        }
        if(locale == "en-US"){
            if(diffInSeconds === 1) return `${diffInSeconds} second ago`;
            return `${diffInSeconds} seconds ago`;
        }
        if(diffInSeconds === 1) return `${diffInSeconds} second ago`;
        return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        if(locale === "es-ES"){
            if(diffInMinutes === 1) return `Hace ${diffInMinutes} minuto`;
            return `Hace ${diffInMinutes} minutos`;
        }
        if(locale == "en-GB"){
            if(diffInMinutes === 1) return `${diffInMinutes} minute ago`;
            return `${diffInMinutes} minutes ago`;
        }
        if(locale == "en-US"){
            if(diffInMinutes === 1) return `${diffInMinutes} minute ago`;
            return `${diffInMinutes} minutes ago`;
        }
        if(diffInMinutes === 1) return `${diffInMinutes} minute ago`;
        return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        if(locale === "es-ES"){
            if(diffInHours === 1) return `Hace ${diffInHours} hora`;
            return `Hace ${diffInHours} horas`;
        }
        if(locale == "en-GB"){
            if(diffInHours === 1) return `${diffInHours} hour ago`;
            return `${diffInHours} hours ago`;
        }
        if(locale == "en-US"){
            if(diffInHours === 1) return `${diffInHours} hour ago`;
            return `${diffInHours} hours ago`;
        }
        if(diffInHours === 1) return `${diffInHours} hour ago`;
        return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        if(locale === "es-ES"){
            if(diffInDays === 1) return `Hace ${diffInDays} dia`;
            return `Hace ${diffInDays} dias`;
        }
        if(locale == "en-GB"){
            if(diffInDays === 1) return `${diffInDays} day ago`;
            return `${diffInDays} days ago`;
        }
        if(locale == "en-US"){
            if(diffInDays === 1) return `${diffInDays} day ago`;
            return `${diffInDays} days ago`;
        }
        if(diffInDays === 1) return `${diffInDays} day ago`;
        return `${diffInDays} days ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        if(locale === "es-ES"){
            if(diffInMonths === 1) return `Hace ${diffInMonths} mes`;
            return `Hace ${diffInMonths} meses`;
        }
        if(locale == "en-GB"){
            if(diffInMonths === 1) return `${diffInMonths} month ago`;
            return `${diffInMonths} months ago`;
        }
        if(locale == "en-US"){
            if(diffInMonths === 1) return `${diffInMonths} month ago`;
            return `${diffInMonths} months ago`;
        }
        if(diffInMonths === 1) return `${diffInMonths} month ago`;
        return `${diffInMonths} months ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    if(locale === "es-ES"){
        if(diffInYears === 1) return `Hace ${diffInYears} año`;
        return `Hace ${diffInYears} años`;
    }
    if(locale == "en-GB"){
        if(diffInYears === 1) return `${diffInYears} year ago`;
        return `${diffInYears} years ago`;
    }
    if(locale == "en-US"){
        if(diffInYears === 1) return `${diffInYears} year ago`;
        return `${diffInYears} years ago`;
    }
    if(diffInYears === 1) return `${diffInYears} year ago`;
    return `${diffInYears} years ago`;
}

export const handleStorageChange = (event) => {

    if (event.key === "user" || event.key === "token") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
  };

export function getCountryKeyByValue(value) {
  return Object.keys(Country).find(key => Country[key] === value);
}