export default function UserWidget() {
    return (
        <div className="absolute" style={{bottom: '2rem'}}>
            <div className="flex-shrink-0 flex hover:bg-gray-800 rounded-full px-4 py-3 mt-12 pr-30">
                <a href={`/user/${JSON.parse(localStorage.getItem("user")).id}`} className="flex-shrink-0 group block">
                    <div className="flex items-center">
                        <div>
                            <img className="inline-block h-10 w-10 rounded-full bg-blue-400"
                                src={localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).avatar : "https://pbs.twimg.com/profile_images/1254779846615420930/7I4kP65u_400x400.jpg"}
                                alt="" />
                        </div>
                        <div className="pl-3">
                            <p className="text-base leading-6 font-medium text-white">
                                {JSON.parse(localStorage.getItem("user")).userName}
                            </p>
                            <p
                                className="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
                                {JSON.parse(localStorage.getItem("user")).tag}
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    )
}