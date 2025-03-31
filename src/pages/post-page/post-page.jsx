import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostById } from '../../services/posts-service';
import PostDetails from '../../components/post/post-details';
import ContentHeader from '../../components/shared/content-header';
import PostForm from '../../components/home/post-form';
import RightMenu from '../../components/shared/right-menu';
import Loading from '../../components/shared/loading';

export default function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPostById(postId);
                const post = await response.json();
                setPost(post);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [postId]);

    return (
        <>
            {
                isLoading ? (
                    <Loading />
                )
                    : (
                        <main role="main">
                            <div className="flex" style={{ width: '990px' }}>
                                <section className="w-3/5 border border-y-0 border-gray-800" style={{ maxwidth: '600px' }}>
                                    <aside>
                                        <ContentHeader route="" title="Post" hasBackButton={true} />

                                        <hr className="border-gray-800" />

                                        <PostForm commentedPostId={0} />

                                        <hr className="border-gray-800 border-4" />
                                    </aside>

                                    <PostDetails post={post} />
                                </section>

                                <RightMenu />
                            </div>
                        </main>
                    )
            }

        </>
    );
}
