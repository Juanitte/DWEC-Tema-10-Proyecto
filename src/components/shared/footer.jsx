export default function Footer() {
    return (
        <>
            <div className="flow-root p-6 inline">
                <div className="flex-1 pl-2 flex flex-row justify-between">
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-300">
                            Terms
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-300">
                            Privacy Policy
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-300">
                            Cookies
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-300">
                            Imprint
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-300">
                            Ads info
                        </p>
                    </a>
                </div>
                <div className="flex-2 pl-2">
                    <p className="text-sm leading-6 font-medium text-gray-400"> © 2025 FireBreath, Inc.</p>
                </div>
            </div>
        </>
    )
}