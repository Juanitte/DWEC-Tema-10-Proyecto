import { useNavigate } from "react-router-dom";

export default function ContentHeader({
  title,
  hasBackButton,
  fallbackRoute = "/",
}) {
  const navigate = useNavigate();

  const goBack = (e) => {
    e.preventDefault();
    const navState = window.history.state;
    // Si tenemos un índice de historial mayor que 0, hacemos “-1”
    if (navState && typeof navState.idx === "number" && navState.idx > 0) {
      navigate(-1);
    } else {
      // Si no, vamos al fallback
      navigate(fallbackRoute);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 mx-2 flex flex-row items-center">
        {hasBackButton && (
          <a
            href="#"
            className="text-2xl font-medium rounded-full text-white hover:bg-green-800"
            onClick={goBack}
          >
            <svg className="m-2 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </a>
        )}
        <h2 className="px-4 py-2 text-xl font-semibold text-white">{title}</h2>
      </div>
    </div>
  );
}