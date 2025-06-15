/** @jsxImportSource @emotion/react */
import Post from "../home/post";
import PostForm from "../home/post-form";
import CommentFeed from "./comment-feed";
import { useTheme } from '@emotion/react';

export default function PostDetails({ post }) {
    const theme = useTheme();

    return (
        <>
            <ul className="list-none">
                <Post post={post} isComment={false} isUserPage={false} />
            </ul>
            <PostForm commentedPostId={post.id} />
            <hr className={`border-[${theme.colors.secondary}]`} />
            <CommentFeed parentAuthor={post.author} postId={post.id} />
        </>
    )
}