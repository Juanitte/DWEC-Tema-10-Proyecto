export default function UserWidget() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="mt-auto pb-2 pr-4 flex justify-end">
            <a href={`/user/${user.id}`} className="flex items-center hover:bg-green-800 rounded-full px-4 py-3">
                <img
                    className="h-10 w-10 rounded-full bg-gray-300"
                    src={user.avatar || "https://pbs.twimg.com/profile_images/1254779846615420930/7I4kP65u_400x400.jpg"}
                    alt=""
                />
                <div className="pl-3 text-right">
                    <p className="text-base leading-6 font-medium text-white">{user.userName}</p>
                    <p className="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
                        {user.tag}
                    </p>
                </div>
            </a>
        </div>
    );
}