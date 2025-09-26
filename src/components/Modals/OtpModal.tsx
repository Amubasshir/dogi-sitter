// import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { supabase } from "../../lib/supabaseClient";

interface VerificationResult {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess?: (result: VerificationResult) => void;
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
}) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
//   const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
    //   toast({
    //     title: "Error",
    //     description: "Please enter a valid 6-digit OTP",
    //     variant: "destructive",
    //   });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: "signup",
      });

      if (error) {
        // Handle error
        console.error("Error verifying OTP:", error);
        return;
      }

      console.log({ data });

      if (data) {
        onVerificationSuccess?.(data);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      const data = {
        email,
      };

      const response = await fetch(
        "https://api.bokaflytthjalp.se/api/v1/otp/resend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      console.log("resend", result);
      if (result.success) {
        // toast({
        //   title: "Success",
        //   description: "OTP resent successfully!",
        // });
        setResendCooldown(60); // 60 seconds cooldown
      } else {
        if (result.error?.code === "RESEND_RATE_LIMIT") {
          const waitTime =
            result.error.details?.[0]?.message.match(/\d+/)?.[0] || 60;
          setResendCooldown(parseInt(waitTime));
        //   toast({
        //     title: "Please wait",
        //     description: result.message,
        //     variant: "destructive",
        //   });
        } else {
        //   toast({
        //     title: "Error",
        //     description: result.message || "Failed to resend OTP",
        //     variant: "destructive",
        //   });
        }
      }
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "An error occurred while resending OTP",
    //     variant: "destructive",
    //   });
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && otp.length === 6) {
      handleVerify();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* Modal Content */}
      <div className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl focus:outline-none">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Verify OTP</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Enter the 6-digit verification code sent to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>

          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                onKeyPress={handleKeyPress}
                className="!w-full !max-w-[40px] h-12 mx-1 text-center text-lg border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            )}
            containerStyle="flex justify-center space-x-2 mb-4"
          />

          <button
            onClick={handleVerify}
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={isResending || resendCooldown > 0}
            className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isResending
              ? "Sending..."
              : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;