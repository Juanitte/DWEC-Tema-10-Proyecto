import { useTranslation } from "react-i18next";
import PostForm from "../../components/home/post-form";
import Timeline from "../../components/home/timeline";
import ContentHeader from "../../components/shared/content-header";
import { useEffect, useRef } from "react";
import { css , useTheme } from '@emotion/react';

export default function HomePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const scrollRef = useRef(null);

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
        <>
            <main role="main" className="flex h-screen overflow-hidden">
                <section
                    className="w-full border border-y-0 flex flex-col overflow-hidden"
                    css={css`
                        border-color: ${theme.colors.primary};
                    `}
                >
                    <ContentHeader title={t('POST-FORM.HEADER')} hasBackButton={false} />
                    <hr css={css`border-color: ${theme.colors.primary};`} />
                    <div ref={scrollRef} className="flex-1 overflow-y-auto">
                        <PostForm commentedPostId={0} />
                        <hr
                            className="border-4"
                            css={css`border-color: ${theme.colors.primary};`}
                        />
                        <Timeline user={user} searchString="" isProfilePage={false} isForLikedPosts={false} />
                    </div>
                </section>
            </main>
        </>
    )
}