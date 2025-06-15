/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import { getAvatar, handleInvalidToken } from "../../services/users-service";
import { css , useTheme} from '@emotion/react';

export default function UserWidget() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [userAvatar, setUserAvatar] = useState(user.avatar);
    const avatarUrlRef = useRef(null);

    const theme = useTheme();

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
            <a
              href={`/user/${user.id}`}
              className="flex items-center rounded-full px-4 py-3"
              css={css`
                &:hover {
                  background-color: ${theme.colors.hoverPrimary};
                }
              `}>
                <img
                    className="h-10 w-10 rounded-full bg-gray-300"
                    src={userAvatar || user.avatar}
                    alt={`${user.userName} avatar`}
                />
                <div className="pl-3 text-right">
                    <p
                      className="text-base leading-6 font-medium"
                      css={css`
                        color: ${theme.colors.text};
                      `}
                    >
                      {user.userName}
                    </p>
                    <p
                      className="text-sm leading-5 font-medium transition ease-in-out duration-150"
                      css={css`
                        color: ${theme.colors.textMid};
                        &:hover {
                          color: ${theme.colors.text};
                        }
                      `}
                    >
                        {user.tag}
                    </p>
                </div>
            </a>
        </div>
    );
}