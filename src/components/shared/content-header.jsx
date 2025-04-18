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
            <div className="flex-1 px-4 py-2 mx-2">
                <a href=""
                    className=" text-2xl font-medium rounded-full text-white hover:bg-green-800 float-right">
                    <svg className="m-2 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <g>
                            <path
                                d="M22.772 10.506l-5.618-2.192-2.16-6.5c-.102-.307-.39-.514-.712-.514s-.61.207-.712.513l-2.16 6.5-5.62 2.192c-.287.112-.477.39-.477.7s.19.585.478.698l5.62 2.192 2.16 6.5c.102.306.39.513.712.513s.61-.207.712-.513l2.16-6.5 5.62-2.192c.287-.112.477-.39.477-.7s-.19-.585-.478-.697zm-6.49 2.32c-.208.08-.37.25-.44.46l-1.56 4.695-1.56-4.693c-.07-.21-.23-.38-.438-.462l-4.155-1.62 4.154-1.622c.208-.08.37-.25.44-.462l1.56-4.693 1.56 4.694c.07.212.23.382.438.463l4.155 1.62-4.155 1.622zM6.663 3.812h-1.88V2.05c0-.414-.337-.75-.75-.75s-.75.336-.75.75v1.762H1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.782v1.762c0 .414.336.75.75.75s.75-.336.75-.75V5.312h1.88c.415 0 .75-.336.75-.75s-.335-.75-.75-.75zm2.535 15.622h-1.1v-1.016c0-.414-.335-.75-.75-.75s-.75.336-.75.75v1.016H5.57c-.414 0-.75.336-.75.75s.336.75.75.75H6.6v1.016c0 .414.335.75.75.75s.75-.336.75-.75v-1.016h1.098c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z">
                            </path>
                        </g>
                    </svg>
                </a>
            </div>
        </div>
    )
}