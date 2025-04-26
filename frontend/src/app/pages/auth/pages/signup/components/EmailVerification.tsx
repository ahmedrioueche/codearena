import Otp from "../../../components/Otp";

interface EmailVerificationProps {
  email: string;
  onSuccess: () => void;
}

const EmailVerification = ({ email, onSuccess }: EmailVerificationProps) => {
  return (
    <div>
      <Otp email={email} onSuccess={() => onSuccess()} />
    </div>
  );
};

export default EmailVerification;
