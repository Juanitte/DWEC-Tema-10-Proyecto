import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UserCard from "./user-card";
import { getTopFollowed } from "../../services/users-service";

export default function Who() {
    const [users, setUsers] = useState([]);
    const { t } = useTranslation();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchTopUsers = async () => {
            console.log("Fetching top users...", user);
            try {
                const response = await getTopFollowed(user.id);
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else if (response.status === 401) {
                    // si estás manejando expiración de token
                    handleInvalidToken();
                } else {
                    console.error("Error al obtener usuarios top seguidos");
                }
            } catch (error) {
                console.error("Error en fetchTopUsers:", error);
            }
        };

        fetchTopUsers();
    }, []);

    return (
        <div className="w-full rounded-lg bg-dim-700 shadow-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-2">{t('WHO.WHO')}</h2>
            <hr className="border-green-800" />

            {
                users.length === 0 ?
                    <p className="pt-4 text-gray-400">{t('WHO.NO-USERS')}</p>
                    :
                    users.map((user) => (
                        <UserCard key={user.id} user={user} isFollowSuggestions={true} />
                    ))
            }

        </div>
    );
}