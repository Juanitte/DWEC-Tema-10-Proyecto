/** @jsxImportSource @emotion/react */
import { useState } from "react";
import RightMenu from "../shared/right-menu";
import UserWidget from "../shared/user-widget";
import Sidenav from "./sidenav";
import { useMediaQuery } from "react-responsive";
import { css, useTheme } from '@emotion/react';
import { AnimatePresence, motion } from "framer-motion";

export default function SiteLayout({ children, isExplorePage = false }) {
    const isMobile = useMediaQuery({ maxWidth: 1024 });
    const theme = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            className={isMobile ? `h-screen flex overflow-hidden pb-6` : `h-screen flex overflow-hidden`}
            css={css`
                background-color: ${theme.colors.background};
                color: ${theme.colors.text};
            `}
        >
            {/* Sidebar fijo en desktop */}
            {!isMobile && (
                <aside className="flex-1 px-2 flex flex-col overflow-y-auto">
                    <Sidenav />
                    <UserWidget />
                </aside>
            )}

            <main className="flex-[2] min-w-0 flex flex-col">
                {/* En móvil: cabecera con hamburguesa */}
                {isMobile && (
                    <header
                        className="flex justify-between items-center px-4 py-2"
                        css={css`
                            background-color: ${theme.colors.surface};
                        `}
                    >
                        <img src="/logo_new_2.png" alt="Logo" className="h-8" />
                        <button
                            onClick={() => setMenuOpen(true)}
                            aria-label="Abrir menú"
                            className="p-2 rounded hover:bg-gray-200"
                        >
                            {/* Icono hamburguesa */}
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </header>
                )}

                {/* Contenido principal */}
                {
                    isMobile &&
                    <hr className={`border-[${theme.colors.secondary}]`} />
                }
                <div className={`flex-1 overflow-auto`}>
                    {children}
                </div>
            </main>

            {/* RightMenu en desktop */}
            {!isMobile && (
                <aside className="flex-1 px-2 overflow-y-auto">
                    <RightMenu isExplorePage={isExplorePage} />
                </aside>
            )}

            {/* Overlay menú móvil */}
            <AnimatePresence>
                {isMobile && menuOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex"
                        css={css`
                            background: rgba(0, 0, 0, 0.4);
                        `}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onClick={() => setMenuOpen(false)}
                    >
                        <motion.aside
                            className={`w-3/4 max-w-xs bg-[${theme.colors.primary}] p-4`}
                            css={css`
                                box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
                            `}
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setMenuOpen(false)}
                                aria-label="Cerrar menú"
                                className={`mb-4 p-2 bg-[${theme.colors.background}] rounded hover:bg-[${theme.colors.hoverPrimary}]`}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke={theme.colors.text}
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <Sidenav isDrawer={true} onLinkClick={() => setMenuOpen(false)} />
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}