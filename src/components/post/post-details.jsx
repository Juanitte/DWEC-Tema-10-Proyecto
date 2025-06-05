import { useEffect, useState } from "react";
import { getComments } from "../../services/posts-service";
import Post from "../home/post";
import PostForm from "../home/post-form";
import CommentFeed from "./comment-feed";
import { handleInvalidToken } from "../../services/users-service";

export default function PostDetails({ post }) {

    return (
        <>
            <ul className="list-none">
                <Post post={post} isComment={false} isUserPage={false} />
            </ul>
            <PostForm commentedPostId={post.id} />
            <hr className="border-green-800" />
            <CommentFeed parentAuthor={post.author} postId={post.id} />
        </>
    )
}