import {
    Country
} from "./enums";

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
        if (locale === "es-ES") {
            if (diffInSeconds === 1) return `Hace ${diffInSeconds} segundo`;
            return `Hace ${diffInSeconds} segundos`;
        }
        if (locale == "en-GB") {
            if (diffInSeconds === 1) return `${diffInSeconds} second ago`;
            return `${diffInSeconds} seconds ago`;
        }
        if (locale == "en-US") {
            if (diffInSeconds === 1) return `${diffInSeconds} second ago`;
            return `${diffInSeconds} seconds ago`;
        }
        if (diffInSeconds === 1) return `${diffInSeconds} second ago`;
        return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        if (locale === "es-ES") {
            if (diffInMinutes === 1) return `Hace ${diffInMinutes} minuto`;
            return `Hace ${diffInMinutes} minutos`;
        }
        if (locale == "en-GB") {
            if (diffInMinutes === 1) return `${diffInMinutes} minute ago`;
            return `${diffInMinutes} minutes ago`;
        }
        if (locale == "en-US") {
            if (diffInMinutes === 1) return `${diffInMinutes} minute ago`;
            return `${diffInMinutes} minutes ago`;
        }
        if (diffInMinutes === 1) return `${diffInMinutes} minute ago`;
        return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        if (locale === "es-ES") {
            if (diffInHours === 1) return `Hace ${diffInHours} hora`;
            return `Hace ${diffInHours} horas`;
        }
        if (locale == "en-GB") {
            if (diffInHours === 1) return `${diffInHours} hour ago`;
            return `${diffInHours} hours ago`;
        }
        if (locale == "en-US") {
            if (diffInHours === 1) return `${diffInHours} hour ago`;
            return `${diffInHours} hours ago`;
        }
        if (diffInHours === 1) return `${diffInHours} hour ago`;
        return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        if (locale === "es-ES") {
            if (diffInDays === 1) return `Hace ${diffInDays} dia`;
            return `Hace ${diffInDays} dias`;
        }
        if (locale == "en-GB") {
            if (diffInDays === 1) return `${diffInDays} day ago`;
            return `${diffInDays} days ago`;
        }
        if (locale == "en-US") {
            if (diffInDays === 1) return `${diffInDays} day ago`;
            return `${diffInDays} days ago`;
        }
        if (diffInDays === 1) return `${diffInDays} day ago`;
        return `${diffInDays} days ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        if (locale === "es-ES") {
            if (diffInMonths === 1) return `Hace ${diffInMonths} mes`;
            return `Hace ${diffInMonths} meses`;
        }
        if (locale == "en-GB") {
            if (diffInMonths === 1) return `${diffInMonths} month ago`;
            return `${diffInMonths} months ago`;
        }
        if (locale == "en-US") {
            if (diffInMonths === 1) return `${diffInMonths} month ago`;
            return `${diffInMonths} months ago`;
        }
        if (diffInMonths === 1) return `${diffInMonths} month ago`;
        return `${diffInMonths} months ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    if (locale === "es-ES") {
        if (diffInYears === 1) return `Hace ${diffInYears} año`;
        return `Hace ${diffInYears} años`;
    }
    if (locale == "en-GB") {
        if (diffInYears === 1) return `${diffInYears} year ago`;
        return `${diffInYears} years ago`;
    }
    if (locale == "en-US") {
        if (diffInYears === 1) return `${diffInYears} year ago`;
        return `${diffInYears} years ago`;
    }
    if (diffInYears === 1) return `${diffInYears} year ago`;
    return `${diffInYears} years ago`;
}

export function formatMessageTime(time) {
    // Parseamos la fecha y validamos
    const postDate = new Date(time.split('.')[0] + 'Z');
    if (isNaN(postDate.getTime())) {
        console.error("Invalid date format:", time);
        return "Invalid date";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    const locale = localStorage.getItem("i18nextLng");

    // 1) Si es del mismo día (< 24h), devolvemos “Hoy” / “Today”
    const diffInHours = Math.floor(diffInSeconds / 3600);
    if (diffInHours < 24) {
        if (locale === "es-ES") return "Hoy";
        return "Today";
    }

    // 2) Menos de 1 minuto → segundos
    if (diffInSeconds < 60) {
        if (locale === "es-ES") {
            return diffInSeconds === 1 ?
                `Hace ${diffInSeconds} segundo` :
                `Hace ${diffInSeconds} segundos`;
        }
        // Inglés (GB o US)
        return diffInSeconds === 1 ?
            `${diffInSeconds} second ago` :
            `${diffInSeconds} seconds ago`;
    }

    // 3) Menos de 1 hora → minutos
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        if (locale === "es-ES") {
            return diffInMinutes === 1 ?
                `Hace ${diffInMinutes} minuto` :
                `Hace ${diffInMinutes} minutos`;
        }
        return diffInMinutes === 1 ?
            `${diffInMinutes} minute ago` :
            `${diffInMinutes} minutes ago`;
    }

    // 4) Menos de 1 día → horas (aquí ya no entrará, porque <24h lo devolvimos como “Hoy”)
    const diffInHrs = diffInHours; // ya calculado arriba
    if (diffInHrs < 24) {
        if (locale === "es-ES") {
            return diffInHrs === 1 ?
                `Hace ${diffInHrs} hora` :
                `Hace ${diffInHrs} horas`;
        }
        return diffInHrs === 1 ?
            `${diffInHrs} hour ago` :
            `${diffInHrs} hours ago`;
    }

    // 5) Días
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        if (locale === "es-ES") {
            return diffInDays === 1 ?
                `Hace ${diffInDays} día` :
                `Hace ${diffInDays} días`;
        }
        return diffInDays === 1 ?
            `${diffInDays} day ago` :
            `${diffInDays} days ago`;
    }

    // 6) Meses
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        if (locale === "es-ES") {
            return diffInMonths === 1 ?
                `Hace ${diffInMonths} mes` :
                `Hace ${diffInMonths} meses`;
        }
        return diffInMonths === 1 ?
            `${diffInMonths} month ago` :
            `${diffInMonths} months ago`;
    }

    // 7) Años
    const diffInYears = Math.floor(diffInMonths / 12);
    if (locale === "es-ES") {
        return diffInYears === 1 ?
            `Hace ${diffInYears} año` :
            `Hace ${diffInYears} años`;
    }
    return diffInYears === 1 ?
        `${diffInYears} year ago` :
        `${diffInYears} years ago`;
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