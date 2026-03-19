import { useEffect, useId, useRef, useState } from "react";
import PropTypes from "prop-types";

import api from "../api/client.js";

const YORKU_EMAIL_REGEX = /^[^@\s]+@(my\.)?yorku\.ca$/i;

const HardwareInviteModal = ({ isOpen, onClose }) => {
  const dialogRef = useRef(null);
  const emailInputRef = useRef(null);
  const previousFocusedRef = useRef(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousFocusedRef.current = previousFocusedElement;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      emailInputRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const focusableElements = Array.from(
        dialog.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previousFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget && status !== "submitting") {
      onClose();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!YORKU_EMAIL_REGEX.test(normalizedEmail)) {
      setStatus("error");
      setErrorMessage("Please enter a valid @yorku.ca or @my.yorku.ca email address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      await api.post("/hardware/request-invite", { email: normalizedEmail });
      setStatus("success");
    } catch (requestError) {
      const apiErrorMessage =
        requestError?.response?.data?.error ||
        "We could not send an invite right now. Please try again in a few minutes.";
      setStatus("error");
      setErrorMessage(apiErrorMessage);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/55 px-4 py-6"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 id={titleId} className="text-lg font-bold leading-tight text-ieee-800">
            Join Hardware Club Discord
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={status === "submitting"}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-ieee-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close dialog"
          >
            x
          </button>
        </div>

        {status === "success" ? (
          <div className="space-y-5">
            <p id={descriptionId} className="text-sm leading-relaxed text-slate-700">
              Check your YorkU inbox. We sent a one-time Discord invite link.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 w-full rounded-lg bg-ieee-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ieee-700 focus:outline-none focus:ring-2 focus:ring-ieee-500 focus:ring-offset-2"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p id={descriptionId} className="text-sm leading-relaxed text-slate-700">
              Enter your York University email to receive a one-time invite link.
            </p>

            <div>
              <label htmlFor="hardware-invite-email" className="mb-2 block text-sm font-semibold text-slate-800">
                YorkU email
              </label>
              <input
                ref={emailInputRef}
                id="hardware-invite-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your.name@my.yorku.ca"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-ieee-500 focus:ring-2 focus:ring-ieee-200"
                disabled={status === "submitting"}
                required
              />
            </div>

            {status === "error" && (
              <p role="alert" className="text-sm font-medium text-red-700">
                {errorMessage}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={status === "submitting"}
                className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="min-h-11 rounded-lg bg-ieee-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ieee-700 focus:outline-none focus:ring-2 focus:ring-ieee-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Sending..." : "Send one-time invite"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

HardwareInviteModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

HardwareInviteModal.defaultProps = {
  isOpen: false
};

export default HardwareInviteModal;