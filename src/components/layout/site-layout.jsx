/** @jsxImportSource @emotion/react */
import RightMenu from "../shared/right-menu";
import UserWidget from "../shared/user-widget";
import Sidenav from "./sidenav";
import { useMediaQuery } from 'react-responsive';
import { css , useTheme } from '@emotion/react';

export default function SiteLayout({ children , isExplorePage = false }) {
    const isMobile = useMediaQuery({ maxWidth: 1024 }); // Tailwind md:1024px
    const theme = useTheme();

    return (
        <div
            className="h-screen flex overflow-hidden"
            css={css`
                background-color: ${theme.colors.background};
                color: ${theme.colors.text};
            `}
            >
            {!isMobile && (
                <aside className="flex-1 px-2 flex flex-col overflow-y-auto">
                    <Sidenav />
                    <UserWidget />
                </aside>
            )}

            <main className="flex-[2] min-w-0 flex justify-center overflow-hidden">
                <div className="w-full overflow-hidden">
                    {children}
                </div>
            </main>

            {!isMobile && (
                <aside className="flex-1 px-2 overflow-y-auto">
                    <RightMenu isExplorePage={isExplorePage} />
                </aside>
            )}
        </div>
    );
}