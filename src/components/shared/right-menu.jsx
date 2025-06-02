import Footer from "./footer";
import Search from "./search";
import Trending from "./trending";
import Who from "./who";

export default function RightMenu() {
    return (
        <div className="h-full w-full px-4 overflow-y-auto">
            <Search />
            <Trending />
            <div className="py-2"></div>
            <Who />
            <Footer />
        </div>
    );
}