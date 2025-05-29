import Footer from "./footer";
import Search from "./search";
import Trending from "./trending";
import Who from "./who";

export default function RightMenu() {
    return (
        <>
            <aside className="w-2/5 h-12 position-relative">
                <div style={{ maxWidth: '350px' }}>
                    <div className="fixed  h-screen px-4">
                        <Search />
                        <Trending />
                        <div className="py-2"></div>
                        <Who />
                        <Footer />
                    </div>
                </div>
            </aside>
        </>
    )
}