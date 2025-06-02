import RightMenu from "../shared/right-menu";
import UserWidget from "../shared/user-widget";
import Sidenav from "./sidenav";
import { useMediaQuery } from 'react-responsive';

export default function SiteLayout({ children }) {
    const isMobile = useMediaQuery({ maxWidth: 1024 }); // Tailwind md:1024px

    return (
        <div className="h-screen bg-[#162b15] text-white flex overflow-hidden">
            {!isMobile && (
                <aside className="flex-1 px-2 flex flex-col overflow-y-auto">
                    <Sidenav />
                    <UserWidget />
                </aside>
            )}

            <main className="flex-[2] min-w-0 flex justify-center overflow-hidden">
                <div className="w-full overflow-hidden">
                    {children}
                </div>
            </main>

            {!isMobile && (
                <aside className="flex-1 px-2 overflow-y-auto">
                    <RightMenu />
                </aside>
            )}
        </div>
    );
}