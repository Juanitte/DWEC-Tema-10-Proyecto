import Sidenav from "./sidenav";

export default function SiteLayout({ children }) {
    return (
        <>
            <div className="flex min-h-screen">
                <Sidenav />
                {children}
            </div>
        </>
    );
}