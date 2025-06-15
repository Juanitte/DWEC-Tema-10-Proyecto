/** @jsxImportSource @emotion/react */
import { useTranslation } from "react-i18next";
import TrendingTimeline from "../trending/trending-timeline";
import { css , useTheme } from '@emotion/react';

export default function Trending() {
    const { t, i18n } = useTranslation();

    const user = localStorage.getItem("user");
    const userCountry = JSON.parse(user).country;
    var countryString = t(`COUNTRIES.${userCountry}`);
    const theme = useTheme();

    return (
        <>
            <div
                className="w-full rounded-lg shadow-lg pt-4"
                css={css`background-color: ${theme.colors.primary};`}
            >
                <div className="flex justify-between items-center mb-2 px-4">
                    <h2
                        className="text-xl font-semibold"
                        css={css`color: ${theme.colors.text};`}
                    >
                        {t('TRENDS.TRENDING-IN')} {countryString}
                    </h2>
                </div>

                <hr css={css`border-color: ${theme.colors.secondary};`} />

            <TrendingTimeline user={user} isWidget={true} />

            </div>
        </>
    )
}