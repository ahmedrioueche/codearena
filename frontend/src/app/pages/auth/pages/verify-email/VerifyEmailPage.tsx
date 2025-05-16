import EmailVerification from "../signup/components/EmailVerification";
import { useAppContext } from "../../../../../context/AppContext";
import { Navigate } from "@tanstack/react-router";
import { updateUser } from "../../../../../api/user";
import toast from "react-hot-toast";
import { handleRedirect } from "../../../../../utils/helper";
import { APP_PAGES } from "../../../../../constants/navigation";

function VerifyEmailPage() {
  const { currentUser, setCurrentUser } = useAppContext();

  const handleSuccess = async () => {
    try {
      await updateUser({ isVerified: true });
      setCurrentUser((prev) => ({
        ...prev,
        isVerified: true,
      }));

      handleRedirect(APP_PAGES.home.route);
    } catch (e) {
      toast.error("email verification failed, please try again");
    }
  };

  if (!currentUser?.email) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <EmailVerification email={currentUser.email} onSuccess={handleSuccess} />
  );
}

export default VerifyEmailPage;
