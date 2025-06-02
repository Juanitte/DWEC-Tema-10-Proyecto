import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getUserById } from '../../services/users-service';
import ContentHeader from '../../components/shared/content-header';
import PostForm from '../../components/home/post-form';
import RightMenu from '../../components/shared/right-menu';
import Timeline from '../../components/home/timeline';
import ProfileCard from '../../components/user/profile-card';

export default function UserPage() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(userId);
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, [userId]);

    // reenviar toda rueda al scroll interno:
    useEffect(() => {
        const onWheel = (e) => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop += e.deltaY;
                // opcional: prevenir que burbujee al body
                e.preventDefault();
            }
        };
        window.addEventListener('wheel', onWheel, { passive: false });
        return () => window.removeEventListener('wheel', onWheel);
    }, []);

    return (
        <main role="main" className="flex h-screen overflow-hidden">
            <section className="w-full border border-y-0 border-green-800 flex flex-col overflow-hidden">
                {user && <ContentHeader route="" title={user.userName} hasBackButton={true} />}
                <hr className="border-green-800" />

                <div ref={scrollRef} className="flex-1 overflow-y-auto">
                    <ProfileCard user={user} />
                    <hr className="border-green-800" />

                    {
                        userId == +loggedUser.id &&
                        <>
                            <PostForm commentedPostId={0} />
                            <hr className="border-green-800 border-4" />
                        </>
                    }

                    <Timeline
                        user={user}
                        searchString=""
                        isForLikedPosts={false}
                        isProfilePage={true}
                    />
                </div>
            </section>
        </main>
    );
}