import { useTranslation } from "react-i18next";
import { follow, getAvatar, handleInvalidToken, unfollow } from "../../services/users-service";
import { useRef } from "react";

export default function UserCard({ user }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [userAvatar, setUserAvatar] = useState(post.authorAvatar);
    const avatarUrlRef = useRef(null);
    const { t } = useTranslation();

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
              }, [post.userId]);

    const handleFollow = async (event) => {
        event.preventDefault();

        if (isFollowing) {
            unfollow(user.id, JSON.parse(localStorage.getItem("user")).id).then((response) => {
                response.json();
                if (response.status === 200) {
                    setIsFollowing(false);
                }
                else if (response.status === 401) {
                    handleInvalidToken();
                }
            });
        } else {
            follow(user.id, JSON.parse(localStorage.getItem("user")).id).then((response) => {
                response.json();
                if (response.status === 200) {
                    setIsFollowing(true);
                }
                else if (response.status === 401) {
                    handleInvalidToken();
                }
            });
        }
    }

    const goToUserPage = (userId, event) => {
        event.stopPropagation();
        navigate(`/user/${userId}`);
    };

    return (
        <div className="flex flex-row items-center justify-between py-4 flex-wrap gap-2"
            onClick={(e) => {
                e.stopPropagation();
                goToUserPage(user.id, e);
            }}
        >
            <div className="flex items-center min-w-0 flex-shrink">
                <img
                    className="h-10 w-10 rounded-full hover:cursor-pointer"
                    src={userAvatar || user.avatar}
                    alt=""
                />
                <div className="text-white pl-3 min-w-0 flex flex-col">
                    <div className="text-white min-w-0">
                        <p className="font-medium truncate">{user.userName}</p>
                        <p className="text-sm text-gray-400 truncate">{user.tag}</p>
                    </div>
                    <div>
                        <p className="text-sm truncate">{user.bio}</p>
                    </div>
                </div>
            </div>

            <div className="ml-auto">
                {
                    isFollowing ?
                        <button onClick={(e) => {e.stopPropagation(); handleFollow(e);}} className="hover:cursor-pointer flex justify-center  max-h-max whitespace-nowrap focus:outline-none  focus:ring  rounded max-w-max border bg-green-700 border-green-700 text-white hover:border-green-600 hover:bg-green-600 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto">
                            {t('BUTTONS.UNFOLLOW')}
                        </button>

                        :
                        <button onClick={(e) => {e.stopPropagation(); handleFollow(e); }} className="hover:cursor-pointer flex justify-center  max-h-max whitespace-nowrap focus:outline-none  focus:ring  rounded max-w-max border bg-green-700 border-green-700 text-white hover:border-green-600 hover:bg-green-600 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto">
                            {t('BUTTONS.FOLLOW')}
                        </button>
                }
            </div>
        </div>
    );
}