"use client";
// components/WriteReviewModalTrigger.tsx
// Prompts unauthenticated users to sign in first, or opens OTP review modal for authenticated users

import { useState, useEffect } from "react";
import OtpModal from "@/components/OtpModal";
import { PenIcon, CheckIcon } from "@/components/Icons";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface WriteReviewModalTriggerProps {
  companyId: number | string;
  companyName: string;
  initialOpen?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  buttonText?: string;
}

export default function WriteReviewModalTrigger({
  companyId,
  companyName,
  initialOpen = false,
  className = "btn-primary text-sm",
  buttonText = "Write a Review",
}: WriteReviewModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();

  // Sync initialOpen when ?write-review=true is present
  useEffect(() => {
    if (searchParams.get("write-review") === "true") {
      if (status === "authenticated") {
        setIsOpen(true);
      }
    }
  }, [searchParams, status]);

  const handleClick = () => {
    // If not signed in, redirect to Sign In page with callbackUrl to return here
    if (status !== "authenticated") {
      const returnUrl = `${pathname}?write-review=true`;
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (params.has("write-review")) {
      params.delete("write-review");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 5000);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`${className} inline-flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs`}
        id={`write-review-trigger-${companyId}`}
      >
        <PenIcon className="w-4 h-4" />
        <span>{buttonText}</span>
      </button>

      {/* Success Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-slide-up">
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <CheckIcon className="w-4 h-4 text-white" />
          </span>
          <div className="text-sm">
            <p className="font-bold">Review Submitted Successfully!</p>
            <p className="text-xs text-emerald-100">Your anonymous review has been verified and posted.</p>
          </div>
        </div>
      )}

      {/* OTP & Review Submission Modal */}
      {isOpen && (
        <OtpModal
          companyId={companyId}
          companyName={companyName}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
