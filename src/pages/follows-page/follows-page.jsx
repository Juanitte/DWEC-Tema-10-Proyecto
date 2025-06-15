/** @jsxImportSource @emotion/react */
import ContentHeader from "../../components/shared/content-header";
import { useEffect, useRef, useState } from "react";
import FollowsTabs from "../../components/user/follows-tabs";
import { useLocation } from "react-router-dom";
import { useTheme } from "@emotion/react";

export default function FollowsPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const initialTab = parseInt(params.get("tab") ?? "0", 10);

  const [index, setIndex] = useState(initialTab);
  const scrollRef = useRef(null);

  const theme = useTheme();

  // Si cambia la query string, actualiza el index
  useEffect(() => {
    const newIndex = parseInt(params.get("tab") ?? "0", 10);
    setIndex(newIndex);
  }, [search]);

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
        <hr className={`border-${theme.colors.secondary}`} />
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <FollowsTabs user={user} index={index} />
        </div>
      </section>
    </main>
  );
}