/** @jsxImportSource @emotion/react */
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getUserById, handleInvalidToken } from '../../services/users-service';
import ContentHeader from '../../components/shared/content-header';
import PostForm from '../../components/home/post-form';
import ProfileCard from '../../components/user/profile-card';
import UserTimelineTabs from '../../components/user/user-timeline-tabs';
import { css , useTheme} from '@emotion/react';

export default function UserPage() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const scrollRef = useRef(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(userId);
                if (response.status === 401) {
                    handleInvalidToken();
                }
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
            <section
                className="w-full border border-y-0 flex flex-col overflow-hidden"
                css={css`border-color: ${theme.colors.secondary};`}
            >
                {user && <ContentHeader title={user.userName} hasBackButton={true} />}
                <hr css={css`border-color: ${theme.colors.secondary};`} />

                <div ref={scrollRef} className="flex-1 overflow-y-auto">
                    <ProfileCard user={user} />
                    <hr css={css`border-color: ${theme.colors.secondary};`} />

                    {
                        userId == +loggedUser.id &&
                        <>
                            <PostForm commentedPostId={0} />
                            <hr css={css`border-color: ${theme.colors.secondary};`} />
                        </>
                    }

                    {
                        user && <UserTimelineTabs user={user} />
                    }
                </div>
            </section>
        </main>
    );
}