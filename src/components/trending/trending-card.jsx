import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function TrendingCard({ hashtag, index, count }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const goToHashtagPage = (event) => {
    event.stopPropagation();
    const encoded = encodeURIComponent(hashtag);
    const newUrl = `/explore?search=${encoded}`;

    // Forzar navegación si ya estamos ahí (no se dispara useLocation)
    if (window.location.pathname + window.location.search === newUrl) {
        // Emitimos un evento personalizado
        window.dispatchEvent(new CustomEvent("search-hashtag-clicked", {
            detail: { query: hashtag }
        }));
    } else {
        navigate(newUrl);
    }
};

    return (
        <>
            <div className="flex flex-col justify-center py-4 px-4 flex-wrap gap-2 hover:bg-green-800 hover:cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    goToHashtagPage(e);
                }}
            >
                <p className="text-xs text-gray-400">{index + 1} . {t('TRENDS.TRENDING')}</p>
                <h2 className="font-bold text-white">{hashtag}</h2>
                <p className="text-xs text-gray-400">{count} {t('TRENDS.POSTS')}</p>
            </div>
            <hr className="border-green-800" />
        </>
    );
}