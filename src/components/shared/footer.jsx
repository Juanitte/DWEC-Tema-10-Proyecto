export default function Footer() {
    return (
        <>
            <div className="flow-root p-6 inline">
                <div className="flex-1 pl-2 flex flex-row justify-between">
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-500">
                            Terms
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-500">
                            Privacy Policy
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-500">
                            Cookies
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-500">
                            Imprint
                        </p>
                    </a>
                    <a href="#">
                        <p className="text-sm leading-6 font-medium text-gray-500">
                            Ads info
                        </p>
                    </a>
                </div>
                <div className="flex-2 pl-2">
                    <p className="text-sm leading-6 font-medium text-gray-600"> © 2025 FireBreath, Inc.</p>
                </div>
            </div>
        </>
    )
}