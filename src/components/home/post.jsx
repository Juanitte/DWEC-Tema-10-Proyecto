import { useEffect, useState } from "react";
import { getCommentCount } from "../../services/api-service";
import { formatPostTime } from "../../utils/utils";

export default function Post( post ) {

    const [commentCount, setCommentCount] = useState(0);
    
        useEffect(() => {
            const fetchCommentCount = async () => {
                try {
                    let response;
                    await getCommentCount(post.post.id)
                        .then((response) => response)
                        .then((data) => (response = data));
                    setCommentCount(response.json());
                } catch (error) {
                    console.error("Error fetching posts:", error);
                }
            };
    
            fetchCommentCount();
    
            const interval = setInterval(fetchCommentCount, 10000);
    
            return () => clearInterval(interval);
    
        }, []);

    return (
        <>
            <div className='flex items-start justify-center'>
                <div className="border-b p-5 w-11/12 bg-[#2b3b4f]">
                    <div className="flex w-full items-center justify-between pb-3">
                        <div className="flex items-center space-x-3">
                            <img src={post.post.authorAvatar} className="h-12 w-12 rounded-full bg-slate-400" />
                            <div className="text-xl font-bold text-gray-100 pl-4">{post.post.author}</div>
                        </div>
                        <div className="flex items-center space-x-8">
                            <div className="text-sm text-gray-100">{formatPostTime(post.post.created)}</div>
                        </div>
                    </div>

                    <div className="mt-4 mb-6">
                        <div className="text-md text-gray-100 pb-4 pl-16">{post.post.content}</div>
                    </div>
                    <div className="pt-2">
                        <div className="flex items-center justify-between text-gray-100 pl-16">
                            <div className="flex gap-2 space-x-4 md:space-x-8">
                                <div className="border rounded flex px-2 cursor-pointer items-center transition hover:text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    <span>{commentCount}</span>
                                </div>
                                <div className="border rounded flex px-2 cursor-pointer items-center transition hover:text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span>4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}