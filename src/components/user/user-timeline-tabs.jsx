import { useState } from "react";
import RepostTimeline from "./repost-timeline";
import Timeline from "../home/timeline";
import CommentTimeline from "./comment-timeline";
import LikeTimeline from "./like-timeline";
import { useTranslation } from "react-i18next";

export default function UserTimelineTabs({ user }) {
    // Tab == 0 -> Posts
    // Tab == 1 -> Replies
    // Tab == 2 -> Shares
    // Tab == 3 -> Likes
    const [tab, setTab] = useState(0);
    const { t } = useTranslation();

    const handleTabClick = (index) => {
        setTab(index);
    };

    console.log("User: ", user);

    return (
        <>
            <div className="flex justify-stretch border-b border-green-800">
                {
                    tab === 0 ? (
                        <button
                            type="button"
                            className="w-full border-gray-300 hover:bg-green-800 text-white whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('PROFILE.POSTS')}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleTabClick(0)}
                            type="button"
                            className="w-full border-transparent text-gray-400 hover:text-gray-200 hover:bg-green-800 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('PROFILE.POSTS')}
                        </button>
                    )
                }
                {
                    tab === 1 ? (
                        <button
                            type="button"
                            className="w-full border-gray-300 hover:bg-green-800 text-white whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('PROFILE.REPLIES')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleTabClick(1)}
                            className="w-full border-transparent text-gray-400 hover:text-gray-200 hover:bg-green-800 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('PROFILE.REPLIES')}
                        </button>
                    )
                }
                {
                    tab === 2 ? (
                        <button
                            type="button"
                            className="w-full border-gray-300 hover:bg-green-800 text-white whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('PROFILE.SHARES')}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleTabClick(2)}
                            type="button"
                            className="w-full border-transparent text-gray-400 hover:text-gray-200 hover:bg-green-800 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('PROFILE.SHARES')}
                        </button>
                    )
                }
                {
                    tab === 3 ? (
                        <button
                            type="button"
                            className="w-full border-gray-300 hover:bg-green-800 text-white whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('PROFILE.LIKES')}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleTabClick(3)}
                            type="button"
                            className="w-full border-transparent text-gray-400 hover:text-gray-200 hover:bg-green-800 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                        >
                            {t('PROFILE.LIKES')}
                        </button>
                    )
                }
            </div>
            {
                tab === 0 && (
                    <Timeline
                        key={user.id}
                        user={user}
                        isProfilePage={true}
                    />
                )
            }
            {
                tab === 1 && (
                    <CommentTimeline
                        key={user.id}
                        user={user}
                    />
                )
            }
            {
                tab === 2 && (
                    <RepostTimeline
                        key={user.id}
                        user={user}
                    />
                )
            }
            {
                tab === 3 && (
                    <LikeTimeline
                        key={user.id}
                        user={user}
                    />
                )
            }
        </>
    );
}