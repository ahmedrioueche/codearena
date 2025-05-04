import EmailVerification from "../signup/components/EmailVerification";
import { useAppContext } from "../../../../../context/AppContext";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { updateUser } from "../../../../../api/user";
import toast from "react-hot-toast";

function VerifyEmailPage() {
  const { currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();

  const handleSuccess = async () => {
    try {
      await updateUser({ isVerified: true });
      setCurrentUser((prev) => ({
        ...prev,
        isVerified: true,
      }));
      navigate({ to: "/" });
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
