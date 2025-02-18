import Otp from "../../../components/Otp";

interface EmailVerificationProps {
  onSubmit: () => void;
}

const EmailVerification = ({ onSubmit }: EmailVerificationProps) => {
  const handleSuccess = () => {
    onSubmit();
  };

  return (
    <div>
      <Otp email={""} onSuccess={() => handleSuccess()} />
    </div>
  );
};

export default EmailVerification;
