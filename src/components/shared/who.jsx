export default function Who() {
    return (
        <>
            <div className="max-w-sm rounded-lg  bg-dim-700 overflow-hidden shadow-lg p-4">
                <div className="flex">
                    <div className="flex-1 p-2">
                        <h2 className="px-4 py-2 text-xl w-48 font-semibold text-white">Who to follow</h2>
                    </div>
                </div>


                <hr className="border-green-800" />

                {/*first person who to follow*/}

                <div className="flex flex-shrink-0 pb-2">
                    <div className="flex-1 ">
                        <div className="flex items-center w-48">
                            <div className="pl-4 pt-2">
                                <img className="inline-block h-10 w-auto rounded-full ml-4 mt-2 hover:cursor-pointer"
                                    src="https://pbs.twimg.com/profile_images/1121328878142853120/e-rpjoJi_bigger.png"
                                    alt="" />
                            </div>
                            <div className="pl-3 pt-3">
                                <p className="text-base leading-6 font-medium text-white hover:cursor-pointer">
                                    Sonali Hirave
                                </p>
                                <p
                                    className="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
                                    @ShonaDesign
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className="flex-1 px-4 py-2 pt-4">
                        <a href="" className=" float-right">
                            <button
                                className="hover: cursor-pointer bg-transparent hover:bg-white text-white font-semibold hover:text-green-800 py-2 px-4 border border-white hover:border-transparent rounded-full">
                                Follow
                            </button>
                        </a>

                    </div>
                </div>
                <hr className="border-green-800" />

                {/*show more*/}

                <div className="flex">
                    <div className="flex-1 p-4 hover: cursor-pointer">
                        <h2 className="px-4 pl-2 w-48 font-bold text-gray-300">Show more</h2>
                    </div>
                </div>

            </div>
        </>
    )
}