/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../../services/posts-service";
import { handleInvalidToken } from "../../services/users-service";
import Loading from "../../components/shared/loading";
import ContentHeader from "../../components/shared/content-header";
import PostDetails from "../../components/post/post-details";
import { useTheme } from '@emotion/react';
import { useTranslation } from "react-i18next";

export default function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef(null);
    const { t } = useTranslation();

    const theme = useTheme();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPostById(postId);
                if (response.status === 401) {
                    handleInvalidToken();
                    return;
                }
                const postData = await response.json();
                setPost(postData);
            } catch (error) {
                console.error('Error fetching post:', error);
                handleInvalidToken();
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

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

    if (isLoading) {
        // Mientras esperamos la respuesta, podemos mostrar un componente <Loading />
        return (
            <main className="h-screen flex items-center justify-center">
                <Loading />
            </main>
        );
    }

    if (!post) {
        // En caso de que no venga el post (404, error, etc.), podemos enseñar un mensaje de “No encontrado”.
        return (
            <main className="h-screen flex items-center justify-center">
                <p className={`text-[${theme.colors.text}] text-xl`}>{t('TIMELINE.NO-POSTS')}</p>
            </main>
        );
    }

    return (
        <main role="main" className="h-screen overflow-hidden">
            <section className={`flex flex-col h-full border border-y-0 border-[${theme.colors.secondary}]`}>
                <ContentHeader title="Post" hasBackButton={true} />
                <hr className={`border-[${theme.colors.secondary}]`} />
                <div ref={scrollRef} className="flex-1 overflow-y-auto">
                    <PostDetails post={post} />
                </div>
            </section>
        </main>
    );
}