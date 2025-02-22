export default function BaseLayout({ children }) {
    return (
        <>
            <div className="bg-gray-100 flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src="/logo_login.png" alt="Placeholder" className="object-cover w-full h-full" />
            </div>
            {children}
            </div>
        </>
    );
}