/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UserCard from "./user-card";
import { getTopFollowed } from "../../services/users-service";
import { css , useTheme} from '@emotion/react';

export default function Who() {
    const [users, setUsers] = useState([]);
    const { t } = useTranslation();
    const theme = useTheme();

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
        <div
            className="w-full rounded-lg shadow-lg py-4"
            css={css`background-color: ${theme.colors.primary};`}
        >
            <h2
                className="text-xl font-semibold mb-2 px-4"
                css={css`color: ${theme.colors.text};`}
            >
                {t('WHO.WHO')}
            </h2>
            <hr css={css`border-color: ${theme.colors.secondary};`} />

            {
                users.length === 0 ?
                    <p
                        className="pt-4"
                        css={css`color: ${theme.colors.textMid};`}
                    >
                        {t('WHO.NO-USERS')}
                    </p>
                    :
                    users.map((user) => (
                        <UserCard key={user.id} user={user} isFollowSuggestions={true} />
                    ))
            }

        </div>
    );
}