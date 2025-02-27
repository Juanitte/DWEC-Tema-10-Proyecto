import { useNavigate } from "react-router-dom";

export default function Sidenav() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    let user = JSON.parse(localStorage.getItem("user"));

    return (
        <aside className="w-[15vw] h-screen" aria-label="Sidebar">
            <div className="h-screen px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col items-center">
                <img src="/logo_dark.png" alt="Placeholder" className="w-30 h-30" />
                <ul className="space-y-4 pt-10">
                    <li>
                        <button
                            onClick={() => navigate("/")}
                            className="hover:cursor-pointer w-full flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <i className="fa-solid fa-house pr-4"></i>
                            <span className="whitespace-nowrap text-2xl rowdies-font">HOME</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate("/explore")}
                            className="hover:cursor-pointer w-full flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <i className="fa-solid fa-magnifying-glass pr-4"></i>
                            <span className="whitespace-nowrap text-2xl rowdies-font">EXPLORE</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigate("/profile")}
                            className="hover:cursor-pointer w-full flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <i className="fa-solid fa-user pr-4"></i>
                            <span className="whitespace-nowrap text-2xl rowdies-font">{user.userName.toUpperCase()}</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="hover:cursor-pointer w-full flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <i className="fa-solid fa-right-from-bracket pr-4"></i>
                            <span className="whitespace-nowrap text-2xl rowdies-font">LOGOUT</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
}