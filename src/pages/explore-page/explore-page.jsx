import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Search from "../../components/shared/search";
import ExploreTimelineTabs from "../../components/explore/explore-timeline-tabs";
import ContentHeader from "../../components/shared/content-header";

export default function ExplorePage() {
    const scrollRef = useRef(null);
    const [searchString, setSearchString] = useState("");
    const { t } = useTranslation();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const onWheel = (e) => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop += e.deltaY;
                // opcional: prevenir que burbujee al body
                e.preventDefault();
            }
        };
        window.addEventListener('wheel', onWheel, { passive: false });
        return () => window.removeEventListener('wheel', onWheel);
    }, []);

    return (
        <main role="main" className="flex h-screen overflow-hidden">
            <section className="w-full border border-y-0 border-green-800 flex flex-col overflow-hidden">
                <ContentHeader route="" title={t('EXPLORE.HEADER')} hasBackButton={true} />
                <hr className="border-green-800" />

                <Search onSearch={q => setSearchString(q)} />

                <div ref={scrollRef} className="flex-1 overflow-y-auto">
                    <ExploreTimelineTabs user={user} searchString={searchString} />
                </div>
            </section>
        </main>
    )
}