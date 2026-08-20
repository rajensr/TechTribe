"use client";
// components/dashboard/WorkplaceVerifyButton.tsx
// "Write a Review" button — click hole OTP modal open hobe
// Stitch mockup: "Verify your workplace" modal

import { useState } from "react";
import OtpModal from "@/components/OtpModal";

export default function WorkplaceVerifyButton() {
  // Modal open/close state
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Button — click hole modal open hobe */}
      <button
        onClick={() => setModalOpen(true)}
        className="btn-primary text-sm"
        id="write-review-dashboard-btn"
      >
        ✍ Write a Review
      </button>

      {/* OTP verification modal */}
      {modalOpen && (
        <OtpModal
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            // Ekhane review form e redirect ba inline open korte pari
            window.location.href = "/companies";
          }}
        />
      )}
    </>
  );
}
