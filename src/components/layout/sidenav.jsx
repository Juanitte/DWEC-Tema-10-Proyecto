/** @jsxImportSource @emotion/react */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { css, useTheme } from '@emotion/react';

export default function Sidenav({ isDrawer = false, onLinkClick }) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const theme = useTheme();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        if (onLinkClick) onLinkClick();
    };

    const containerAlignment = isDrawer
        ? "items-start text-start"
        : "items-end text-end";

    let user = JSON.parse(localStorage.getItem("user"));

    const handleNav = (to) => {
        navigate(to);
        if (onLinkClick) onLinkClick();
    };

    return (
        <>
            <div
                className={isDrawer ? "flex justify-start mb-4" : "flex justify-end pr-4 mb-4"}
            >
                <img src="/logo_new_2.png" alt="Logo" className="w-20 h-20" />
            </div>
            <nav
                className={`pt-5 px-2 flex flex-col gap-1 ${isDrawer ? "items-start text-start" : "items-end text-start"}`}
            >
                <a
                    onClick={() => handleNav("/")}
                    className={`max-w-[200px] w-full hover:cursor-pointer group flex items-center justify-start px-2 py-2 text-base leading-6 font-semibold rounded-full ${!isDrawer ? "ml-auto" : ""}`}
                    css={css`
                        color: ${theme.colors.text};
                        &:hover { background-color: ${theme.colors.hoverPrimary}; }
                    `}
                >

                    <svg className="mr-4 h-6 w-6 " stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6"></path>
                    </svg>
                    <span className="pl-2">
                        {t('SIDENAV.HOME')}
                    </span>
                </a>
                <a
                    onClick={() => handleNav("/explore")}
                    className={`max-w-[200px] w-full hover:cursor-pointer group flex items-center justify-start px-2 py-2 text-base leading-6 font-semibold rounded-full ${!isDrawer ? "ml-auto" : ""}`}
                    css={css`
                        color: ${theme.colors.text};
                        &:hover {
                            background-color: ${theme.colors.hoverPrimary};
                        }
                    `}
                >
                    <svg className="mr-4 h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                    <span className="pl-2">
                        {t('SIDENAV.EXPLORE')}
                    </span>
                </a>
                <a
                    onClick={() => handleNav(`/chats/${user.id}`)}
                    className={`max-w-[200px] w-full hover:cursor-pointer group flex items-center justify-start px-2 py-2 text-base leading-6 font-semibold rounded-full ${!isDrawer ? "ml-auto" : ""}`}
                    css={css`
                        color: ${theme.colors.text};
                        &:hover {
                            background-color: ${theme.colors.hoverPrimary};
                        }
                    `}
                >
                    <svg className="mr-4 h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                        </path>
                    </svg>
                    <span className="pl-2">
                        {t('SIDENAV.MESSAGES')}
                    </span>
                </a>
                <a
                    onClick={() => handleNav(`/saved/${user.id}`)}
                    className={`max-w-[200px] w-full hover:cursor-pointer group flex items-center justify-start px-2 py-2 text-base leading-6 font-semibold rounded-full ${!isDrawer ? "ml-auto" : ""}`}
                    css={css`
                        color: ${theme.colors.text};
                        &:hover {
                            background-color: ${theme.colors.hoverPrimary};
                        }
                    `}
                >
                    <svg className="mr-4 h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                    <span className="pl-2">
                        {t('SIDENAV.BOOKMARKS')}
                    </span>
                </a>
                <a
                    onClick={() => handleNav(`/user/${user.id}`)}
                    className={`max-w-[200px] w-full hover:cursor-pointer group flex items-center justify-start px-2 py-2 text-base leading-6 font-semibold rounded-full ${!isDrawer ? "ml-auto" : ""}`}
                    css={css`
                        color: ${theme.colors.text};
                        &:hover {
                            background-color: ${theme.colors.hoverPrimary};
                        }
                    `}
                >
                    <svg className="mr-4 h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="pl-2">
                        {t('SIDENAV.PROFILE')}
                    </span>
                </a>
                <a
                    onClick={() => handleNav(`/settings`)}
                    className={`max-w-[200px] w-full hover:cursor-pointer group flex items-center justify-start px-2 py-2 text-base leading-6 font-semibold rounded-full ${!isDrawer ? "ml-auto" : ""}`}
                    css={css`
                        color: ${theme.colors.text};
                        &:hover {
                            background-color: ${theme.colors.hoverPrimary};
                        }
                    `}
                >
                    <svg className="mr-4 h-5 w-5" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 512 512">
                        <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
                    </svg>
                    <span className="pl-2">
                        {t('SIDENAV.SETTINGS')}
                    </span>
                </a>
                <a
                    onClick={() => handleLogout()}
                    className={`max-w-[200px] w-full hover:cursor-pointer group flex items-center justify-start px-2 py-2 text-base leading-6 font-semibold rounded-full ${!isDrawer ? "ml-auto" : ""}`}
                    css={css`
                        color: ${theme.colors.text};
                        &:hover {
                            background-color: ${theme.colors.hoverPrimary};
                        }
                    `}
                >
                    <svg className="mr-4 h-5 w-5" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 512 512">
                        <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                    </svg>
                    <span className="pl-2">
                        {t('SIDENAV.LOGOUT')}
                    </span>
                </a>
            </nav>
        </>
    );
}