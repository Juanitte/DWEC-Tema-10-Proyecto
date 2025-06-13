import { useEffect, useState } from "react";
import { getFollowersPage, getFollowingPage, handleInvalidToken } from "../../services/users-service";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import Loading from "../shared/loading";
import UserCard from "../shared/user-card";

export default function FollowsTimeline({ user, tab, isFollowers = false }) {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        setFollowers([]);
        setFollowing([]);
        setPage(1);
        setHasMore(true);
        setIsLoading(true);
    }, [isFollowers]);



    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await getFollowersPage(user.id, page);
                if (response.status === 401) {
                    handleInvalidToken();
                }
                const data = await response.json();
                setFollowers(data);

            } catch (error) {
                console.error("Error fetching followers:", error);
                handleInvalidToken();
            }
        };
        const fetchFollowing = async () => {
            try {
                const response = await getFollowingPage(user.id, page);
                if (response.status === 401) {
                    handleInvalidToken();
                }
                const data = await response.json();
                setFollowing(data);
            } catch (error) {
                console.error("Error fetching following:", error);
                handleInvalidToken();
            }
        };

        isFollowers ?
            fetchFollowers()
            :
            fetchFollowing();
    }, [tab]);

    const loadMore = () => {
        if (!hasMore || isLoading) return;
        setPage(prev => prev + 1);
    };

    const loaderRef = useInfiniteScroll(loadMore, hasMore, isLoading);

    return (
        <>
            <ul className="list-none">
                {
                    isFollowers &&
                    followers.map(user => (
                        <UserCard key={user.id} user={user} isFollowSuggestions={false} />
                    ))
                }
                {
                    !isFollowers &&
                    following.map(user => (
                        <UserCard key={user.id} user={user} isFollowSuggestions={false} />
                    ))
                }
            </ul>

            <div ref={loaderRef} className="h-10 flex justify-center items-center">
                {isLoading && <Loading />}
            </div>
        </>
    );
}