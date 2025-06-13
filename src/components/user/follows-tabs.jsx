import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FollowsTimeline from "./follows-timeline";

export default function FollowsTabs({ user, index = 0 }) {
    // Tab == 0 -> Following
    // Tab == 1 -> Followers
    const [tab, setTab] = useState(index);
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
                            {t('FOLLOWS.FOLLOWING')}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleTabClick(0)}
                            type="button"
                            className="w-full border-transparent text-gray-400 hover:text-gray-200 hover:bg-green-800 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('FOLLOWS.FOLLOWING')}
                        </button>
                    )
                }
                {
                    tab === 1 ? (
                        <button
                            type="button"
                            className="w-full border-gray-300 hover:bg-green-800 text-white whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('FOLLOWS.FOLLOWERS')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleTabClick(1)}
                            className="w-full border-transparent text-gray-400 hover:text-gray-200 hover:bg-green-800 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('FOLLOWS.FOLLOWERS')}
                        </button>
                    )
                }
            </div>
            {
                tab === 0 && (
                    <FollowsTimeline
                        user={user}
                        tab={tab}
                        isFollowers={false}
                    />
                )
            }
            {
                tab === 1 && (
                    <FollowsTimeline
                        user={user}
                        tab={tab}
                        isFollowers={true}
                    />
                )
            }
        </>
    );
}