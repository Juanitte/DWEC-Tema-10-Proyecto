export default function BaseLayout({ children }) {
  return (
    <>
      <div className="bg-gray-100 flex justify-center items-center min-h-screen">
        <div className="w-1/2 h-screen hidden lg:block bg-[#3a9932] overflow-hidden">
          <img
            src="/logo_login_new_2.png"
            alt="Placeholder"
            className="object-cover w-full h-full animate-zoom"
          />
        </div>
        <div className="lg:w-1/2 md:w-full sm:w-full max-h-screen overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}