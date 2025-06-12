import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPInputProps {
  otpCode: string;
  setOtpCode: (value: string) => void;
  handleOnComplete: (otp: string) => Promise<void>;
  hasError: boolean;
  isLoading: boolean;
  isNavigating?: boolean;
  // setHasError: (value: boolean) => void;
  setShouldShowOtpField: (value: boolean) => void;
}

export function OTPInput({
  otpCode,
  setOtpCode,
  handleOnComplete,
  hasError,
  // setHasError,
  isLoading,
  isNavigating,
  setShouldShowOtpField,
}: OTPInputProps) {
  return (
    <div className="flex flex-col space-y-4 items-center">
      <InputOTP
        value={otpCode}
        onChange={(value) => setOtpCode(value)}
        onComplete={handleOnComplete}
        maxLength={6}
        disabled={isLoading}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      {(isLoading || isNavigating) && (
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <span className="text-sm text-gray-400">
            {isLoading ? "Verifying..." : "Redirecting..."}
          </span>
        </div>
      )}

      {hasError && (
        <span className="text-sm text-red-500 dark:text-red-900">
          Invalid OTP code. Try again
        </span>
      )}

      {/* {isLoading && } */}

      <div className="flex space-x-2">
        <span className="text-sm text-[#878787]">
          Didn&apos;t receive the email?
        </span>
        <button
          onClick={() => {
            setShouldShowOtpField(false);
            setOtpCode("");
          }}
          type="button"
          className="text-sm text-white underline font-medium"
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
