import PostForm from "../../components/home/post-form";
import Timeline from "../../components/home/timeline";
import ContentHeader from "../../components/shared/content-header";
import RightMenu from "../../components/shared/right-menu";

export default function HomePage() {
    return (
        <>
            <main role="main">
                <div className="flex" style={{width: '990px'}}>
                    <section className="w-3/5 border border-y-0 border-green-800" style={{maxwidth:'600px'}}>
                        <aside>
                            <ContentHeader route="" title="Home" hasBackButton={false} />

                            <hr className="border-green-800" />
                            
                            <PostForm commentedPostId={0} />

                            <hr className="border-green-800 border-4" />
                        </aside>

                        <Timeline userId={0} searchString="" />
                    </section>

                    <RightMenu />
                </div>
            </main>
        </>
    )
}