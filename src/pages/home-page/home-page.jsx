import { useTranslation } from "react-i18next";
import PostForm from "../../components/home/post-form";
import Timeline from "../../components/home/timeline";
import ContentHeader from "../../components/shared/content-header";
import RightMenu from "../../components/shared/right-menu";

export default function HomePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { t , i18n } = useTranslation();

    return (
        <>
            <main role="main">
                <div className="flex" style={{width: '990px'}}>
                    <section className="w-3/5 border border-y-0 border-green-800" style={{maxwidth:'600px'}}>
                        <aside>
                            <ContentHeader route="" title={t('POST-FORM.HEADER')} hasBackButton={false} />

                            <hr className="border-green-800" />
                            
                            <PostForm commentedPostId={0} />

                            <hr className="border-green-800 border-4" />
                        </aside>

                        <Timeline user={user} searchString="" isProfilePage={false} isForLikedPosts={false} />
                    </section>

                    <RightMenu />
                </div>
            </main>
        </>
    )
}