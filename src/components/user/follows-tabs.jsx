/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FollowsTimeline from "./follows-timeline";
import { useTheme } from "@emotion/react";

export default function FollowsTabs({ user, index = 0 }) {
    // Tab == 0 -> Following
    // Tab == 1 -> Followers
    const [tab, setTab] = useState(index);
    const { t } = useTranslation();

    const theme = useTheme();

    const handleTabClick = (index) => {
        setTab(index);
    };

    return (
        <>
            <div className={`flex justify-stretch border-b border-${theme.colors.secondary}`}>
                {
                    tab === 0 ? (
                        <button
                            type="button"
                            className={`w-full border-[${theme.colors.textMid}] hover:bg-[${theme.colors.hoverPrimary}] text-[${theme.colors.text}] whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {t('PROFILE.FOLLOWING')}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleTabClick(0)}
                            type="button"
                            className={`w-full border-transparent text-${theme.colors.textMid} hover:text-[${theme.colors.text}] hover:bg-[${theme.colors.hoverPrimary}] hover:border-[${theme.colors.textMid}] whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {t('PROFILE.FOLLOWING')}
                        </button>
                    )
                }
                {
                    tab === 1 ? (
                        <button
                            type="button"
                            className={`w-full border-[${theme.colors.textMid}] hover:bg-[${theme.colors.hoverPrimary}] text-[${theme.colors.text}] whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {t('PROFILE.FOLLOWERS')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleTabClick(1)}
                            className={`w-full border-transparent text-${theme.colors.textMid} hover:text-[${theme.colors.text}] hover:bg-[${theme.colors.hoverPrimary}] hover:border-[${theme.colors.textMid}] whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {t('PROFILE.FOLLOWERS')}
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