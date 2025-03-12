import { useState } from "react";
import { CreatePostDto } from "../../models/createPostDto";
import { createPost } from "../../services/api-service";
import { handleInvalidToken } from "../../services/api-service";

export default function PostForm() {
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [postText, setPostText] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handlePost = (event) => {
        event.preventDefault();

        let post = new CreatePostDto(user.userName, user.tag, user.avatar, postText, files, user.id);
        console.log(post);
        createPost(post).then((response) => {
            response.json();
            if(response.status === 200) {
                setPostText('');
            }
            else if (response.status === 401) {
                handleInvalidToken();
            }
        });;
        setImages([]);
        setFiles([]);
    };

    return (
        <>
            <div className="bg-[#2b3b4f] shadow p-4 pb-8 pt-2">
                <div className="editor w-full mx-auto flex flex-col text-gray-800 border-b border-gray-300 p-4">
                    <textarea value={postText} onChange={(e) => setPostText(e.target.value)} className="description rounded bg-[#9eb6d3] sec p-3 h-13 border border-gray-300 outline-none" spellCheck="false" placeholder="Write your post here"></textarea>
                    <div className="p-1"></div>
                    <div className="icons flex text-gray-300 m-2">
                        <label id="select-image">
                            <svg className="mr-2 cursor-pointer hover:text-gray-300 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <input
                                hidden
                                type="file"
                                multiple
                                onChange={(event) => {
                                    const files = Array.from(event.target.files).map(file => ({
                                        url: URL.createObjectURL(file),
                                        name: file.name,
                                        preview: ['jpg', 'jpeg', 'png', 'gif'].includes(file.name.split('.').pop().toLowerCase()),
                                        size: file.size > 1024 ? (file.size > 1048576 ? Math.round(file.size / 1048576) + 'mb' : Math.round(file.size / 1024) + 'kb') : file.size + 'b'
                                    }));
                                    setImages(files);
                                    setFiles(Array.from(event.target.files));
                                }}
                            />
                        </label>
                        <div className="pl-2 count ml-auto text-gray-300 text-xs font-semibold">{postText.length}/300</div>
                    </div>

                    <div id="preview" className="my-4 flex flex-wrap gap-2">
                        {images.map((image, index) => (
                            <div key={index} className="relative w-32 h-32 object-cover rounded">
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

                                <div className="text-xs text-center p-2">{image.size}</div>
                            </div>
                        ))}
                    </div>

                    <div className="buttons flex justify-end">
                        <div onClick={handlePost} className="btn border rounded border-[#285184] p-1 px-4 font-semibold cursor-pointer text-gray-100 ml-2 bg-[#285184]">Post</div>
                    </div>
                </div>
            </div>
        </>
    );
}
