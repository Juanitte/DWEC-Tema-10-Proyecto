/** @jsxImportSource @emotion/react */
import { useTranslation } from "react-i18next";
import ContentHeader from "../../components/shared/content-header";
import { useEffect, useRef } from "react";
import Language from "../../components/settings/language";
import ThemeSelector from "../../components/settings/theme-selector";
import { css , useTheme} from '@emotion/react';

export default function ConfigPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { t, i18n } = useTranslation();
    const scrollRef = useRef(null);
    const theme = useTheme();

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
                <section
                    className="w-full border border-y-0 flex flex-col overflow-hidden"
                    css={css`border-color: ${theme.colors.secondary};`}
                >
                    <ContentHeader title={t('HEADER.CONFIG')} hasBackButton={true} />
                    <hr css={css`border-color: ${theme.colors.secondary};`} />
                    <div ref={scrollRef} className="flex-1 overflow-y-auto pl-4">
                        <Language user={user} />
                        <hr css={css`border-color: ${theme.colors.secondary};`} />
                        <ThemeSelector />
                        <hr css={css`border-color: ${theme.colors.secondary};`} />
                    </div>
                </section>
            </main>
        </>
    )
}