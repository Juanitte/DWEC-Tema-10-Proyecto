import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../../services/posts-service";
import { handleInvalidToken } from "../../services/users-service";
import Loading from "../../components/shared/loading";
import ContentHeader from "../../components/shared/content-header";
import PostForm from "../../components/home/post-form";
import PostDetails from "../../components/post/post-details";

export default function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef(null);

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
                <p className="text-white text-xl">El post no existe o hubo un error al cargarlo.</p>
            </main>
        );
    }

    return (
        <main role="main" className="h-screen overflow-hidden">
            <section className="flex flex-col h-full border border-y-0 border-green-800">
                <ContentHeader title="Post" hasBackButton={true} />
                <hr className="border-green-800 border-4" />
                <div ref={scrollRef} className="flex-1 overflow-y-auto">
                    <PostDetails post={post} />
                </div>
            </section>
        </main>
    );
}