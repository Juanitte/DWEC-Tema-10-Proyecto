import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Search from "../../components/shared/search";
import ExploreTimelineTabs from "../../components/explore/explore-timeline-tabs";
import ContentHeader from "../../components/shared/content-header";

export default function ExplorePage() {
    const { search } = useLocation();
    const [searchString, setSearchString] = useState("");
    const scrollRef = useRef(null);
    const { t } = useTranslation();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const params = new URLSearchParams(search);
        const newSearchString = params.get("search") || "";
        setSearchString(newSearchString);
    }, [search]);

    useEffect(() => {
        const handler = (e) => {
            const clicked = e.detail.query;

            // Forzamos cambio incluso si el valor es el mismo
            setSearchString("");
            setTimeout(() => {
                setSearchString(clicked);
            }, 0);
        };

        window.addEventListener("search-hashtag-clicked", handler);
        return () => window.removeEventListener("search-hashtag-clicked", handler);
    }, []);

    useEffect(() => {
        const onWheel = (e) => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop += e.deltaY;
                e.preventDefault();
            }
        };
        window.addEventListener("wheel", onWheel, { passive: false });
        return () => window.removeEventListener("wheel", onWheel);
    }, []);

    // Cuando pulso Enter en este Search, sólo actualizo el estado local
    const onSearch = (q) => {
        setSearchString(q);
    };

    return (
        <main role="main" className="flex h-screen overflow-hidden">
            <section className="w-full border border-y-0 border-green-800 flex flex-col overflow-hidden">
                <ContentHeader
                    title={t("EXPLORE.HEADER")}
                    hasBackButton={true}
                />
                <hr className="border-green-800" />

                <Search
                    searchString={searchString}
                    setSearchString={setSearchString}
                    onSearch={onSearch}
                    isExplorePage={true}
                />

                <div ref={scrollRef} className="flex-1 overflow-y-auto">
                    <ExploreTimelineTabs key={searchString} user={user} searchString={searchString} />
                </div>
            </section>
        </main>
    );
}