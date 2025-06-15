/** @jsxImportSource @emotion/react */
import ContentHeader from "../../components/shared/content-header";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import MessageTimeline from "../../components/message/message-timeline";

export default function MessagesPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const scrollRef = useRef(null);

  const theme = useTheme();

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

  return (
    <main role="main" className="flex h-screen overflow-hidden">
      <section className={`w-full border border-y-0 border-[${theme.colors.secondary}] flex flex-col overflow-hidden`}>
        <ContentHeader title={user.userName} hasBackButton={true} />
        <hr className={`border-[${theme.colors.secondary}]`} />
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <MessageTimeline user={user} />
        </div>
      </section>
    </main>
  );
}