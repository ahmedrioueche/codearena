import { useNavigate } from "@tanstack/react-router";
import useScreen from "../hooks/useScreen";
import { APP_PAGES } from "../constants/navigation";

const ErrorPage = ({
  type = "global",
  message,
}: {
  type?: "global" | "local";
  message?: string;
}) => {
  const navigate = useNavigate();
  const { isMobile } = useScreen();

  const handleClick = () => {
    type === "global"
      ? navigate({ to: APP_PAGES.home.route })
      : window.location.reload();
  };

  const defaultMessage =
    type === "local" ? "Something went wrong" : "Oops! System Error";

  const actionText = type === "local" ? "Try Again" : "Return Home";

  return (
    <div
      className={`
      flex flex-col md:flex-row items-center justify-center 
      min-h-screen w-full px-4
      bg-dark-background 
      text-light-text-primary dark:text-dark-text-primary
      ${type === "local" ? "-mt-20" : ""}
    `}
    >
      {/* Branding Section */}
      <div className="text-center mb-10 md:mb-0 md:mr-12 lg:mr-16">
        <div className="relative inline-block">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-dancing">
            CodeArena
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        </div>
        <p className="text-blue-300 text-lg mt-3">
          Where Code Meets the Cosmos
        </p>
      </div>

      {/* Error Content */}
      <div className="flex flex-col items-center md:items-start max-w-md">
        {type === "global" && !isMobile && (
          <img
            src="/500.svg"
            alt="Error Illustration"
            className="w-40 h-40 mb-6 md:w-48 md:h-48"
          />
        )}

        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-light-primary dark:text-dark-primary mb-4">
            {defaultMessage}
          </h1>

          <p className="text-base text-light-text-secondary dark:text-dark-text-secondary mb-8">
            {message ||
              "We encountered an unexpected error. Please try again or return home."}
          </p>

          <button
            onClick={handleClick}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium 
                     hover:opacity-90 transition-opacity duration-200 
                     shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-background"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
