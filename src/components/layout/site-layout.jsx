import RightMenu from "../shared/right-menu";
import UserWidget from "../shared/user-widget";
import Sidenav from "./sidenav";
import { useMediaQuery } from 'react-responsive';

export default function SiteLayout({ children }) {
    const isMobile = useMediaQuery({ maxWidth: 1024 }); // Tailwind md:1024px

    return (
        <div className="h-screen bg-[#162b15] text-white flex overflow-hidden">
            {/* Columna izquierda */}
            {!isMobile && (
                <aside className="w-[250px] flex-shrink-0 flex flex-col fixed h-screen left-0 z-10">
                    <Sidenav />
                    <UserWidget />
                </aside>
            )}

            {/* Contenido principal */}
            <main className={`flex-1 flex justify-center ${!isMobile ? 'ml-[250px] mr-[300px]' : ''}`}>
                <div className="w-full max-w-[800px] overflow-hidden">
                    {children}
                </div>
            </main>

            {/* Columna derecha */}
            {!isMobile && (
                <aside className="w-[300px] flex-shrink-0 fixed right-0 h-screen z-10">
                    <RightMenu />
                </aside>
            )}
        </div>
    );
}