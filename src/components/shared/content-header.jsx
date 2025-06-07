import { useNavigate } from "react-router-dom";


export default function ContentHeader({ route, title, hasBackButton }) {
    const navigate = useNavigate();

    const goToTargetPage = () => {
        navigate(`/${route}`);
    }

    return (
        <div className="flex">
            <div className="flex-1 mx-2 flex flex-row items-center">
                {
                    hasBackButton ?
                        <a href=""
                            className=" text-2xl font-medium rounded-full text-white hover:bg-green-800 float-left"
                            onClick={goToTargetPage}>
                            <svg className="m-2 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <g>
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                                </g>
                            </svg>
                        </a>
                    :
                        <></>
                }
                <h2 className="px-4 py-2 text-xl font-semibold text-white">{title}</h2>
            </div>
        </div>
    )
}