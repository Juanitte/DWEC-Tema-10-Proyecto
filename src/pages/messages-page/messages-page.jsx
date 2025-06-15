/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef } from "react";
import { useTheme } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import ContentHeader from "../../components/shared/content-header";
import MessageTimeline from "../../components/message/message-timeline";

export default function MessagesPage() {
  const navigate = useNavigate();
  const { id } = useParams();              // <-- url param
  const user = JSON.parse(localStorage.getItem("user"));
  const scrollRef = useRef(null);
  const theme = useTheme();

  // 1) Validación del param vs user.id
  useEffect(() => {
    // Comparamos como strings, pero puedes usar Number(id) === user.id si id es numérico
    if (id && id != user.id) {
      navigate("/", { replace: true });
    }
  }, [id, user.id, navigate]);

  // 2) Scroll hijacking (tu lógica original)
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
      <section
        className="w-full border border-y-0 flex flex-col overflow-hidden"
        css={{
          borderColor: theme.colors.secondary
        }}
      >
        <ContentHeader title={user.userName} hasBackButton={true} />
        <hr css={{ borderColor: theme.colors.secondary }} />
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <MessageTimeline user={user} />
        </div>
      </section>
    </main>
  );
}