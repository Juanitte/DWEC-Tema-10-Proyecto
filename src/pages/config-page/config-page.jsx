import { useTranslation } from "react-i18next";
import PostForm from "../../components/home/post-form";
import Timeline from "../../components/home/timeline";
import ContentHeader from "../../components/shared/content-header";
import { useEffect, useRef } from "react";
import Language from "../../components/settings/language";
import ThemeSelector from "../../components/settings/theme-selector";

export default function ConfigPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { t, i18n } = useTranslation();
    const scrollRef = useRef(null);

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
                    <ContentHeader title={t('HEADER.CONFIG')} hasBackButton={true} />
                    <hr className="border-green-800" />
                    <div ref={scrollRef} className="flex-1 overflow-y-auto">
                        <Language user={user} />
                        <hr className="border-green-800" />
                        <ThemeSelector />
                        <hr className="border-green-800" />
                    </div>
                </section>
            </main>
        </>
    )
}