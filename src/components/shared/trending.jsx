import { useTranslation } from "react-i18next";
import TrendingTimeline from "../trending/trending-timeline";

export default function Trending() {
    const { t, i18n } = useTranslation();

    const user = localStorage.getItem("user");
    const userCountry = JSON.parse(user).country;
    var countryString = t(`COUNTRIES.${userCountry}`);

    return (
        <>
            <div className="w-full rounded-lg bg-dim-700 shadow-lg pt-4">
                <div className="flex justify-between items-center mb-2 px-4">
                    <h2 className="text-xl font-semibold text-white">
                        {t('TRENDS.TRENDING-IN')} {countryString}
                    </h2>
                </div>

                <hr className="border-green-800" />

            <TrendingTimeline user={user} isWidget={true} />

            </div>
        </>
    )
}