/** @jsxImportSource @emotion/react */
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getUserById, handleInvalidToken } from '../../services/users-service';
import ContentHeader from '../../components/shared/content-header';
import { useTranslation } from 'react-i18next';
import SavedTimeline from '../../components/save/saved-timeline';
import { css , useTheme} from '@emotion/react';

export default function SavedPage() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    const scrollRef = useRef(null);
    const { t } = useTranslation();
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
                {user && <ContentHeader title={t('SAVED.HEADER')} hasBackButton={true} />}
                <hr css={css`border-color: ${theme.colors.secondary};`} />

                <div ref={scrollRef} className="flex-1 overflow-y-auto">

                    <SavedTimeline user={user} />

                </div>
            </section>
        </main>
    );
}