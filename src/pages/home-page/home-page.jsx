import PostForm from "../../components/home/post-form";
import Timeline from "../../components/home/timeline";
import Suggestions from "../../components/shared/suggestions";

export default function HomePage() {
    return (
        <>
            <div className="bg-gray-100 flex flex-row h-screen w-[85vw]">
                <div className="flex flex-col w-[70vw]">
                    <PostForm />
                    <Timeline />
                </div>
                <div className="flex flex-col w-[15vw] border-l border-gray-300">
                    <Suggestions />
                </div>
            </div>
        </>
    )
}