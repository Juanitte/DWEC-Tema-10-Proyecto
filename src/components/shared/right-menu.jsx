import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Search from "./search";
import Trending from "./trending";
import Who from "./who";
import Footer from "./footer";

export default function RightMenu({ isExplorePage = false }) {
    const navigate = useNavigate();
    const [searchString, setSearchString] = useState("");

    const handleSearch = (query) => {
        // navegamos a /explore y volcamos el query en la URL
        navigate(`/explore?search=${encodeURIComponent(query)}`);
    };

    return (
        <div className="h-full w-full px-4 overflow-y-auto">
            {
                !isExplorePage ? (
                    <Search
                        searchString={searchString}
                        setSearchString={setSearchString}
                        onSearch={handleSearch}
                        isExplorePage={false}
                    />
                ) : (
                    <div className="py-4"></div>
                )
            }
            <Trending />
            <div className="py-2"></div>
            <Who />
        </div>
    );
}