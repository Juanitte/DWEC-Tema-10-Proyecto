import { useEffect, useState } from "react";
import Loading from "../shared/loading";
import { follow, getFollowers, getFollowing, handleInvalidToken, unfollow } from "../../services/users-service";
import UsersModal from "./users-modal";
import { useTranslation } from "react-i18next";

export default function ProfileCard({ user }) {
    if (!user) return <Loading />;

    const userCreatedDate = new Date(user.created);
    const locale = localStorage.getItem("i18nextLng");
    var formattedDate;

    if(locale == "es-ES")
        formattedDate = userCreatedDate.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });
    else if(locale == "en-GB")
        formattedDate = userCreatedDate.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric'
        });
    else if(locale == "en-US")
        formattedDate = userCreatedDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

    var dateString;

    if(locale == "es-ES")
        dateString = formattedDate.replace(/ (\d{4})$/, ' $1');
    else if(locale == "en-GB")
        dateString = formattedDate.replace(/ (\d{4})$/, ', $1');
    else if(locale == "en-US")
        dateString = formattedDate.replace(/ (\d{4})$/, ', $1');

    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isForFollowers, setIsForFollowers] = useState(false);
    const { t } = useTranslation();

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await getFollowers(user.id);
                if(response.status === 401) {
                    handleInvalidToken();
                }
                const data = await response.json();
                setFollowers(data);
                const loggedInUserId = JSON.parse(localStorage.getItem("user")).id;
                const alreadyFollowing = data.some(f => f.id === +loggedInUserId);
                setIsFollowing(alreadyFollowing);
              
            } catch (error) {
                console.error("Error fetching followers:", error);
            }
        };
        const fetchFollowing = async () => {
            try {
                const response = await getFollowing(user.id);
                if(response.status === 401) {
                    handleInvalidToken();
                }
                const data = await response.json();
                setFollowing(data);
            } catch (error) {
                console.error("Error fetching following:", error);
            }
        };
        fetchFollowers();
        fetchFollowing();
    }, [isFollowing]);

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


    return (
        <>
            <div className="pt-10">
                <div className="p-4">
                    <div className="relative flex w-full">
                        {/* Avatar */}
                        <div className="flex flex-1">
                            <div>
                                <div style={{ height: '9rem', width: '9rem' }} className="md rounded-full relative avatar">
                                    <img
                                        style={{ height: '9rem', width: '9rem' }}
                                        className="bg-gray-300 md rounded-full relative border-4 border-gray-900"
                                        src={user.avatar}
                                        alt="" />
                                    <div className="absolute"></div>
                                </div>
                            </div>
                        </div>
                        {/* Follow Button */}
                        <div className="flex flex-col text-right">
                            {
                                user.id == JSON.parse(localStorage.getItem('user')).id ?
                                    <button className="hover:cursor-pointer flex justify-center  max-h-max whitespace-nowrap focus:outline-none  focus:ring  rounded max-w-max border bg-transparent border-green-500 text-white hover:border-green-300 hover:bg-green-600 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto">
                                        {t('PROFILE.EDIT-PROFILE')}
                                    </button>
                                    :
                                    isFollowing ? (
                                        <button onClick={(event) => { handleFollow(event) }} className="hover:cursor-pointer flex justify-center  max-h-max whitespace-nowrap focus:outline-none  focus:ring  rounded max-w-max border bg-transparent border-green-500 text-white hover:border-green-300 hover:bg-green-600 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto">
                                            {t('BUTTONS.UNFOLLOW')}
                                        </button>
                                    )
                                        :
                                        <button onClick={(event) => { handleFollow(event) }} className="hover:cursor-pointer flex justify-center  max-h-max whitespace-nowrap focus:outline-none  focus:ring  rounded max-w-max border bg-transparent border-green-500 text-white hover:border-green-300 hover:bg-green-600 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto">
                                            {t('BUTTONS.FOLLOW')}
                                        </button>
                            }
                        </div>
                    </div>

                    {/* Profile info */}
                    <div className="space-y-1 justify-center w-full pt-3 pl-3">
                        {/* User basic*/}
                        <div>
                            <h2 className="text-xl leading-6 font-bold text-white">{user.userName}</h2>
                            <p className="text-sm leading-5 font-medium text-gray-400">{user.tag}</p>
                        </div>
                        {/* Description and others */}
                        <div className="pt-3">
                            <p className="text-white leading-tight pb-2">{user.bio}</p>
                            <div className="text-gray-400 flex">
                                <span className="flex pr-2"><svg viewBox="0 0 24 24" className="h-5 w-5 paint-icon"><g><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path></g></svg>
                                    <a href="https://github.com/Juanitte" target="_blank" className="leading-5 ml-1 text-blue-400">github.com/Juanitte</a></span>
                                <span className="flex pr-2"><svg viewBox="0 0 24 24" className="h-5 w-5 paint-icon"><g><path d="M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z"></path><circle cx="7.032" cy="8.75" r="1.285"></circle><circle cx="7.032" cy="13.156" r="1.285"></circle><circle cx="16.968" cy="8.75" r="1.285"></circle><circle cx="16.968" cy="13.156" r="1.285"></circle><circle cx="12" cy="8.75" r="1.285"></circle><circle cx="12" cy="13.156" r="1.285"></circle><circle cx="7.032" cy="17.486" r="1.285"></circle><circle cx="12" cy="17.486" r="1.285"></circle></g></svg> <span className="leading-5 ml-1">
                                    {t('PROFILE.JOINED')} {dateString}
                                </span>
                                </span>
                            </div>
                        </div>
                        <div className="pt-3 flex justify-start items-start w-full divide-x divide-green-800 divide-solid">
                            <div onClick={() => { setIsForFollowers(false); setIsOpen(true) }} className="text-center pr-3 hover:cursor-pointer">
                                <span className="font-bold text-white">
                                    {
                                        following.length
                                    }
                                </span>
                                <span className="text-gray-400 pl-2">
                                    {t('PROFILE.FOLLOWING')}
                                </span>
                            </div>
                            <div onClick={() => { setIsForFollowers(true); setIsOpen(true) }} className="text-center px-3 hover:cursor-pointer">
                                <span className="font-bold text-white">
                                    {
                                        followers.length
                                    }
                                </span>
                                <span className="text-gray-400 pl-2">
                                    {t('PROFILE.FOLLOWERS')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                isForFollowers ?
                    <UsersModal isOpen={isOpen} onClose={handleClose} isForFollowers={isForFollowers} users={followers} />
                :
                    <UsersModal isOpen={isOpen} onClose={handleClose} isForFollowers={isForFollowers} users={following} />    
            }
        </>
    );
}