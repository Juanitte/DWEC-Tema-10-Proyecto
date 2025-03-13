import { useNavigate } from "react-router-dom";

export default function UsersModal({ isOpen, onClose, isForFollowers, users }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <>
            {/* Fondo oscuro, al hacer clic cierra el modal */}
            <div
                className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50"
                onClick={onClose}
            >
                {/* Contenedor del modal */}
                <div
                    className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-96 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Botón de cierre */}
                    <button
                        className="absolute top-3 right-3 text-white text-xl"
                        onClick={onClose}
                    >
                        &times;
                    </button>

                    <div className="flex flex-col items-center space-y-4 font-semibold text-gray-500">
                        <h1 className="text-white text-2xl pb-4">
                            {isForFollowers ? "Followers" : "Following"}
                        </h1>

                        {
                            users.map((user) => (
                                <>
                                    <hr className="border-gray-800" />


                                    <div className="flex flex-shrink-0">
                                        <div className="flex-1 ">
                                            <div className="flex items-center w-48">
                                                <div onClick={() => {navigate(`/user/${user.id}`)}} className="pl-4 pt-2">
                                                    <img className="bg-blue-400 inline-block h-10 w-auto rounded-full ml-4 mt-2 hover:cursor-pointer"
                                                        src={user.avatar}
                                                        alt="" />
                                                </div>
                                                <div onClick={() => {navigate(`/user/${user.id}`)}} className="pl-3 pt-3">
                                                    <p className="text-base leading-6 font-medium text-white hover:cursor-pointer">
                                                        {user.userName}
                                                    </p>
                                                    <p
                                                        className="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
                                                        {user.tag}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="flex-1 px-4 py-3">
                                            <a href="" className=" float-right">
                                                <button
                                                    className="hover: cursor-pointer bg-transparent hover:bg-white text-white font-semibold hover:text-gray-800 py-2 px-4 border border-white hover:border-transparent rounded-full">
                                                    Follow
                                                </button>
                                            </a>

                                        </div>
                                    </div>
                                    <hr className="border-gray-800" />
                                </>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

