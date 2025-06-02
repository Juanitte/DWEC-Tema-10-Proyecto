import { useTranslation } from "react-i18next";

export default function Trending() {
    const { t , i18n } = useTranslation();

    const user = localStorage.getItem("user");
    const userCountry = JSON.parse(user).country;
    var countryString = t(`COUNTRIES.${userCountry}`);

    return (
        <>
            <div className="w-full max-w-md rounded-lg bg-dim-700 shadow-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold text-white">
                            {t('TRENDS.TRENDING-IN')} {countryString}
                        </h2>
                        <a href=""
                            className="text-white hover:bg-green-800 p-2 rounded-full">
                            <svg className="h-6 w-6" fill="none" strokeLinecap="round"
                                strokeLinejoin="round" strokeWidth="2" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                                </path>
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </a>
                    </div>

                <hr className="border-green-800" />

                {/*first trending tweet*/}
                <div className="hover:bg-green-900 px-2 py-3 rounded">
                    <p className="text-xs text-gray-400">1 . {t('TRENDS.TRENDING')}</p>
                    <h2 className="font-bold text-white">#React</h2>
                    <p className="text-xs text-gray-400">5,466 {t('TRENDS.POSTS')}</p>
                </div>
                <hr className="border-green-800 my-2" />

                {/*show more*/}

                <div className="hover:cursor-pointer px-2 py-2">
                    <h2 className="font-bold text-gray-200">{t('TRENDS.SHOW-MORE')}</h2>
                </div>

            </div>
        </>
    )
}