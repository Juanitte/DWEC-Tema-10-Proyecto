/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../shared/loading";
import TrendingCard from "./trending-card";
import { getTopHashtags } from "../../services/posts-service";
import {css , useTheme} from '@emotion/react';

export default function TrendingTimeline({ user, isWidget = false }) {
    const [hashtags, setHashtags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();
    const theme = useTheme();

    useEffect(() => {
        const fetchHashtags = async () => {
            try {
                setIsLoading(true);
                const response = isWidget ? await getTopHashtags(12, 3) : await getTopHashtags(12);

                if (!response.ok) throw new Error("Error fetching hashtags");

                const data = await response.json();
                setHashtags(data);

            } catch (error) {
                console.error("Failed to load hashtags:", error);
                setHashtags([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHashtags();
    }, []);

    return (
        <>
            <ul className="list-none">
                {
                    hashtags.length == 0 ?
                        <p
                            className="pt-4 pl-4 text-sm"
                            css={css`color: ${theme.colors.textMid};
                            `}
                        >
                            {t('TRENDS.NO-TRENDS')}
                        </p>
                        :
                        hashtags.map(hashtag => (
                            <TrendingCard key={hashtag.text} hashtag={hashtag.text} index={hashtags.indexOf(hashtag)} count={hashtag.count} />
                        ))
                }
            </ul>

            <div className="h-10 flex justify-center items-center">
                {isLoading && <Loading />}
            </div>
        </>
    );
}