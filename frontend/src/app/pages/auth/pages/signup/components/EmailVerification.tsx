import Otp from "../../../components/Otp";

interface EmailVerificationProps {
  email: string;
  onSuccess: () => void;
  onBack?: () => void;
}

const EmailVerification = ({
  email,
  onSuccess,
  onBack,
}: EmailVerificationProps) => {
  return (
    <div>
      <Otp email={email} onSuccess={() => onSuccess()} onBack={onBack} />
    </div>
  );
};

export default EmailVerification;
