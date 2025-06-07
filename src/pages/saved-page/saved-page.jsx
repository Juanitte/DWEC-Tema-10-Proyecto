import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getUserById, handleInvalidToken } from '../../services/users-service';
import ContentHeader from '../../components/shared/content-header';
import PostForm from '../../components/home/post-form';
import ProfileCard from '../../components/user/profile-card';
import UserTimelineTabs from '../../components/user/user-timeline-tabs';
import { useTranslation } from 'react-i18next';
import SavedTimeline from '../../components/save/saved-timeline';

export default function SavedPage() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const scrollRef = useRef(null);
    const { t } = useTranslation();

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
            <section className="w-full border border-y-0 border-green-800 flex flex-col overflow-hidden">
                {user && <ContentHeader route="" title={t('SAVED.HEADER')} hasBackButton={true} />}
                <hr className="border-green-800" />

                <div ref={scrollRef} className="flex-1 overflow-y-auto">

                    <SavedTimeline user={user} />

                </div>
            </section>
        </main>
    );
}