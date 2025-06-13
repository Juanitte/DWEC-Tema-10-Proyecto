import { useTranslation } from "react-i18next";
import ContentHeader from "../../components/shared/content-header";
import { useEffect, useRef, useState } from "react";
import FollowsTabs from "../../components/user/follows-tabs";
import { useLocation } from "react-router-dom";

export default function FollowsPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { tab } = useLocation();
    const { t, i18n } = useTranslation();
    const [index, setIndex] = useState(+tab);
    const scrollRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(tab);
        const newIndex = params.get("tab") || "";
        setIndex(+newIndex);
    }, [tab]);

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
        <>
            <main role="main" className="flex h-screen overflow-hidden">
                <section className="w-full border border-y-0 border-green-800 flex flex-col overflow-hidden">
                    <ContentHeader title={user.userName} hasBackButton={true} />
                    <hr className="border-green-800" />
                    <div ref={scrollRef} className="flex-1 overflow-y-auto">
                        <FollowsTabs index={index} />
                    </div>
                </section>
            </main>
        </>
    )
}