import Post from "../home/post";

export default function CommentFeed({ comments }) {
    return (
        <>
            <ul className="list-none">
                {comments.map((comment) => (
                    <Post post={comment} isComment={true} key={comment.id} />
                ))}
            </ul>
        </>
    )
}