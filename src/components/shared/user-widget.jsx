import { useEffect, useRef, useState } from "react";
import { getAvatar, handleInvalidToken } from "../../services/users-service";

export default function UserWidget() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [userAvatar, setUserAvatar] = useState(user.avatar);
    const avatarUrlRef = useRef(null);

    useEffect(() => {
                let isMounted = true;
                (async () => {
                  try {
                    const res = await getAvatar(user.id);
                    if (res.ok) {
                      const blob = await res.blob();
                      const objectUrl = URL.createObjectURL(blob);
                      if (isMounted) {
                        setUserAvatar(objectUrl);
                        avatarUrlRef.current = objectUrl;
                      }
                    } else if (res.status === 404) {
                      console.warn("Avatar no encontrado, usar fallback");
                    } else if (res.status === 401) {
                      handleInvalidToken();
                    } else {
                      console.error("Error al obtener avatar:", await res.text());
                    }
                  } catch (err) {
                    console.error("Excepción al fetch-avatar:", err);
                  }
                })();
            
                // Cleanup: revocar object URL para liberar memoria
                return () => {
                  isMounted = false;
                  if (avatarUrlRef.current) URL.revokeObjectURL(avatarUrlRef.current);
                };
              }, [user.id]);

    return (
        <div className="mt-auto pb-2 pr-4 flex justify-end">
            <a href={`/user/${user.id}`} className="flex items-center hover:bg-green-800 rounded-full px-4 py-3">
                <img
                    className="h-10 w-10 rounded-full bg-gray-300"
                    src={userAvatar || user.avatar}
                    alt={`${user.userName} avatar`}
                />
                <div className="pl-3 text-right">
                    <p className="text-base leading-6 font-medium text-white">{user.userName}</p>
                    <p className="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150">
                        {user.tag}
                    </p>
                </div>
            </a>
        </div>
    );
}