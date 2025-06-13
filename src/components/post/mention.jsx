import { useEffect, useState } from "react";
import { getUserByTag } from "../../services/users-service";

export function Mention({ tag, navigate }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await getUserByTag(tag);
        if (!active) return;

        if (res.ok) {
          const data = await res.json();
          if (active && +data?.id != 0) {
            setUserId(data.id);
          }
        }
      } catch (err) {
        console.error("Error fetching user by tag:", err);
      }
    })();

    return () => {
      active = false;
    };
  }, [tag]);

  if (!userId) {
    return <>{tag}</>;
  }

  return (
    <a
      className="text-blue-400 hover:underline"
      onClick={(e) => {
        e.preventDefault();
        navigate(`/user/${userId}`);
      }}
    >
      {tag}
    </a>
  );
}