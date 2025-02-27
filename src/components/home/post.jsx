export default function Post() {
    return (
        <>
            <div className='flex items-start justify-center'>
                <div className="border-b p-5 w-11/12 bg-[#2b3b4f]">
                    <div className="flex w-full items-center justify-between pb-3">
                        <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-full bg-slate-400 bg-[url('https://i.pravatar.cc/32')]"></div>
                            <div className="text-lg font-bold text-gray-100 pl-4">Joe Smith</div>
                        </div>
                        <div className="flex items-center space-x-8">
                            <div className="text-md text-gray-100">2 hours ago</div>
                        </div>
                    </div>

                    <div className="mt-4 mb-6">
                        <div className="text-sm text-gray-100 pb-4">Aliquam a tristique sapien, nec bibendum urna. Maecenas convallis dignissim turpis, non suscipit mauris interdum at. Morbi sed gravida nisl, a pharetra nulla. Etiam tincidunt turpis leo, ut mollis ipsum consectetur quis. Etiam faucibus est risus, ac condimentum mauris consequat nec. Curabitur eget feugiat massa</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between text-gray-100">
                            <div className="flex space-x-4 md:space-x-8">
                                <div className="flex px-2 cursor-pointer items-center transition hover:text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    <span>125</span>
                                </div>
                                <div className="flex cursor-pointer items-center transition hover:text-gray-400">
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