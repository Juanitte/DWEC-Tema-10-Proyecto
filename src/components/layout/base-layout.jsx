import { useMediaQuery } from "react-responsive";

export default function BaseLayout({ children }) {
  const isMobile = useMediaQuery({ maxWidth: 1024 });
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
        <div className={ isMobile ? `lg:w-1/2 md:w-full sm:w-full max-h-screen overflow-y-auto pb-10` : `lg:w-1/2 md:w-full sm:w-full max-h-screen overflow-y-auto`}>
          {children}
        </div>
      </div>
    </>
  );
}