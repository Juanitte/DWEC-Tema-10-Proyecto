import { useState } from "react";
import { useTranslation } from "react-i18next";
import SearchTimeline from "./search-timeline";

export default function ExploreTimelineTabs({ user , searchString }) {
    // Tab == 0 -> Posts
    // Tab == 1 -> Users
    const [tab, setTab] = useState(0);
    const { t } = useTranslation();

    const handleTabClick = (index) => {
        setTab(index);
    };

    return (
        <>
            <div className="flex justify-stretch border-b border-green-800">
                {
                    tab === 0 ? (
                        <button
                            type="button"
                            className="w-full border-gray-300 hover:bg-green-800 text-white whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('EXPLORE.POSTS')}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleTabClick(0)}
                            type="button"
                            className="w-full border-transparent text-gray-400 hover:text-gray-200 hover:bg-green-800 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('EXPLORE.POSTS')}
                        </button>
                    )
                }
                {
                    tab === 1 ? (
                        <button
                            type="button"
                            className="w-full border-gray-300 hover:bg-green-800 text-white whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('EXPLORE.USERS')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleTabClick(1)}
                            className="w-full border-transparent text-gray-400 hover:text-gray-200 hover:bg-green-800 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('EXPLORE.USERS')}
                        </button>
                    )
                }
            </div>
            {
                tab === 0 && (
                    <SearchTimeline
                        user={user}
                        searchString={searchString}
                        isPosts={true}
                    />
                )
            }
            {
                tab === 1 && (
                    <SearchTimeline
                        user={user}
                        searchString={searchString}
                        isUsers={true}
                    />
                )
            }
        </>
    );
}