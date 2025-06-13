import { useTranslation } from "react-i18next";
import ContentHeader from "../../components/shared/content-header";
import { useEffect, useRef, useState } from "react";
import FollowsTabs from "../../components/user/follows-tabs";

export default function MessagesPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [index, setIndex] = useState(initialTab);
  const scrollRef = useRef(null);

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
      <section className="w-full border border-y-0 border-green-800 flex flex-col overflow-hidden">
        <ContentHeader title={user.userName} hasBackButton={true} />
        <hr className="border-green-800" />
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <FollowsTabs user={user} index={index} />
        </div>
      </section>
    </main>
  );
}