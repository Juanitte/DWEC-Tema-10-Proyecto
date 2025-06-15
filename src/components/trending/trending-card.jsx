/** @jsxImportSource @emotion/react */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { css , useTheme} from '@emotion/react';

export default function TrendingCard({ hashtag, index, count }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();

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
            <div
                className="flex flex-col justify-center py-4 flex-wrap gap-2 hover:bg-green-800 hover:cursor-pointer"
                css={css`
                    &:hover {
                        background-color: ${theme.colors.hoverPrimary};
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    goToHashtagPage(e);
                }}
            >
                <p
                    className="pl-4 text-xs"
                    css={css`
                        color: ${theme.colors.textMid};
                    `}
                >
                    {index + 1} . {t('TRENDS.TRENDING')}
                </p>
                <h2
                    className="pl-4 font-bold"
                    css={css`
                        color: ${theme.colors.text};
                    `}
                >
                    {hashtag}
                </h2>
                <p
                    className="pl-4 text-xs"
                    css={css`color: ${theme.colors.textMid};`}
                >
                    {count} {t('TRENDS.POSTS')}
                </p>
            </div>
            <hr css={css`border-color: ${theme.colors.secondary};`} />
        </>
    );
}