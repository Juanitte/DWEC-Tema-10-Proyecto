import { useTranslation } from "react-i18next";

export default function Who() {
    const { t, i18n } = useTranslation();

    return (
        <div className="w-full max-w-md rounded-lg bg-dim-700 shadow-lg p-4 mb-4">
            <h2 className="text-xl font-semibold text-white mb-2">{t('WHO.WHO')}</h2>
            <hr className="border-green-800" />

            {/* first person who to follow */}
            <div className="flex flex-row items-center justify-between py-4 flex-wrap gap-2">
                <div className="flex items-center min-w-0 flex-shrink">
                    <img
                        className="h-10 w-10 rounded-full hover:cursor-pointer"
                        src="https://pbs.twimg.com/profile_images/1121328878142853120/e-rpjoJi_bigger.png"
                        alt=""
                    />
                    <div className="text-white pl-3 min-w-0">
                        <p className="font-medium truncate">Sonali Hirave</p>
                        <p className="text-sm text-gray-400 truncate">@ShonaDesign</p>
                    </div>
                </div>

                <div className="ml-auto">
                    <button className="bg-transparent hover:bg-white text-white hover:text-green-800 py-1 px-4 border border-white rounded-full text-sm whitespace-nowrap">
                        {t('BUTTONS.FOLLOW')}
                    </button>
                </div>
            </div>

            <hr className="border-green-800" />

            {/* show more */}
            <div className="pt-2 hover:cursor-pointer">
                <h2 className="font-bold text-gray-300">{t('WHO.SHOW-MORE')}</h2>
            </div>
        </div>
    );
}