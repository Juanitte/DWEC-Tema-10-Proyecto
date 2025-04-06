import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserById } from '../../services/users-service';
import ContentHeader from '../../components/shared/content-header';
import PostForm from '../../components/home/post-form';
import RightMenu from '../../components/shared/right-menu';
import Timeline from '../../components/home/timeline';
import ProfileCard from '../../components/user/profile-card';

export default function UserPage() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const loggedUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(userId);
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, [userId]);

    return (
        <>
            <main role="main">
                <div className="flex" style={{ width: '990px' }}>
                    <section className="w-3/5 border border-y-0 border-green-800" style={{ maxwidth: '600px' }}>
                        <aside>
                            {user && <ContentHeader route="" title={user.userName} hasBackButton={true} />}

                            <hr className="border-green-800" />

                            <ProfileCard user={user} />

                            <hr className="border-green-800" />

                            {
                                user && user.id === loggedUser.id &&
                                <>
                                    <PostForm commentedPostId={0} />
                                    <hr className="border-green-800 border-4" />
                                </>
                            }


                        </aside>

                        <Timeline user={user} searchString="" isForLikedPosts={false} isProfilePage={true} />
                    </section>

                    <RightMenu />
                </div>
            </main>

        </>
    );
}