import UserWidget from "../shared/user-widget";
import Sidenav from "./sidenav";

export default function SiteLayout({ children }) {
    return (
        <>
            <div className="p-relative h-screen" style={{ backgroundColor: '#162b15' }}>
                <div className="flex justify-center">

                    <header className="text-white h-12 py-4 h-auto">
                        <div style={{ width: '275px' }}>
                            <div className="fixed h-screen pr-3" style={{width: '275px'}}>
                                <Sidenav />
                                <UserWidget />
                            </div>
                        </div>
                    </header>
                    {children}
                </div>
            </div>
        </>
    );
}