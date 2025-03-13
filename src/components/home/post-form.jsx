import { useState, useRef, useEffect } from "react";
import { CreatePostDto } from "../../models/createPostDto";
import { createPost, handleInvalidToken } from "../../services/api-service";

export default function PostForm({ commentedPostId }) {
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [postText, setPostText] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const fileInputRef = useRef(null);
    const textAreaRef = useRef(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [postText]);

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePost = (event) => {
        event.preventDefault();

        let post;
        if (commentedPostId !== 0)
            post = new CreatePostDto(user.userName, user.tag, user.avatar, postText, files, user.id, commentedPostId);
        else
            post = new CreatePostDto(user.userName, user.tag, user.avatar, postText, files, user.id, 0);

        createPost(post).then((response) => {
            response.json();
            if (response.status === 200) {
                setPostText('');
                setImages([]);
                setFiles([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
            else if (response.status === 401) {
                handleInvalidToken();
            }
        });
    };

    return (
        <>
            <div className="flex p-2">
                <div className="m-2 w-10 py-1">
                    <img className="inline-block h-10 w-10 rounded-full bg-blue-400"
                        src={localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).avatar : "https://pbs.twimg.com/profile_images/1254779846615420930/7I4kP65u_400x400.jpg"}
                        alt="" />
                </div>
                <div className="flex-1 px-2 pt-2 mt-2">
                    <textarea
                        className=" bg-transparent text-gray-400 font-medium text-lg w-full"
                        rows="2"
                        cols="50"
                        placeholder={commentedPostId === 0 ? "What's happening?" : "Comment..."}
                        value={postText}
                        onChange={(e) => {
                            if (e.target.value.length <= 500) {
                                setPostText(e.target.value);
                            }
                        }} ></textarea>
                </div>
            </div>

            <div className="flex p-2">
                <div className="w-10"></div>

                <div className="w-64 px-2">
                    <div className="flex items-center">

                        <div className="flex-1 text-center py-2 m-2">
                            <a
                                className="hover:cursor-pointer mt-1 group flex justify-center items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="2" stroke="silver"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </a>
                            <input
                                ref={fileInputRef}
                                hidden
                                type="file"
                                multiple
                                accept="image/jpeg, image/png, image/gif"
                                onChange={(event) => {
                                    const selectedFiles = Array.from(event.target.files);
                                    const imagePreviews = selectedFiles.map(file => ({
                                        url: URL.createObjectURL(file),
                                        name: file.name,
                                        preview: ['jpg', 'jpeg', 'png', 'gif'].includes(file.name.split('.').pop().toLowerCase()),
                                        size: file.size > 1024 ? (file.size > 1048576 ? Math.round(file.size / 1048576) + 'mb' : Math.round(file.size / 1024) + 'kb') : file.size + 'b'
                                    }));
                                    setImages(imagePreviews);
                                    setFiles(selectedFiles);
                                }}
                            />
                        </div>

                        <div className="flex-1 text-center py-2 m-2">
                            <a href="#"
                                className="mt-1 group flex justify-center items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300">
                                <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="2" stroke="silver"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z">
                                    </path>
                                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </a>
                        </div>
                        {
                            commentedPostId === 0 ?
                                <div className="flex-1 text-center py-2 m-2">
                                    <a href="#"
                                        className="mt-1 group flex justify-center items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300">
                                        <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round"
                                            strokeLinejoin="round" strokeWidth="2" stroke="silver"
                                            viewBox="0 0 24 24">
                                            <path
                                                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                                            </path>
                                        </svg>
                                    </a>
                                </div>
                                :
                                <></>
                        }
                        <div className="flex-1 text-center py-2 m-2">
                            <a href="#"
                                className="mt-1 group flex justify-center items-center text-blue-400 px-2 py-2 text-base leading-6 font-medium rounded-full hover:bg-gray-800 hover:text-blue-300">
                                <svg className="text-center h-7 w-6" fill="none" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="2" stroke="silver"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                    </path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>


                <div className="flex-1">
                    <button
                        onClick={handlePost}
                        className="hover:cursor-pointer bg-blue-400 hover:bg-blue-500 mt-5 text-white font-bold py-2 px-8 rounded-full mr-8 float-right">
                        {
                            commentedPostId == 0 ? 'Post' : 'Reply'
                        }
                    </button>
                </div>
            </div>
            <div id="preview" className="px-4 flex flex-wrap gap-2">
                {images.map((image, index) => (
                    <div key={index} className="relative w-32 object-cover rounded">
                        {image.preview ? (
                            <img src={image.url} className="w-32 h-32 object-cover rounded" alt="preview" />
                        ) : (
                            <svg className="fill-current w-32 h-32" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                            </svg>
                        )}
                        <button
                            onClick={() => removeImage(index)}
                            className="w-6 h-6 absolute top-0 right-0 m-2 text-white text-sm bg-red-500 hover:text-red-700 hover:bg-gray-100 rounded-full flex items-center justify-center leading-none"
                        >
                            X
                        </button>

                        <div className="text-xs text-center p-2 text-gray-300">{image.size}</div>
                    </div>
                ))}
            </div>
        </>
    );
}
