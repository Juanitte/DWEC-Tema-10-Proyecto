import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPostById } from '../../services/api-service';
import PostDetails from '../../components/post/post-detail';

export default function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await getPostById(postId);
                setPost(post);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [postId]);

    if (!post) {
        return <div>Post not found!</div>;
    }

    return (
        <>
            <PostDetails post={post} />
        </>
    );
}
