import { useEffect, useId, useMemo, useRef } from "react";
import PropTypes from "prop-types";

const MessageModal = ({ message, onClose }) => {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusedRef = useRef(null);

  const titleId = useId();
  const descriptionId = useId();

  const titleText = useMemo(() => {
    if (typeof message?.title === "string" && message.title.trim().length > 0) {
      return message.title;
    }
    return "Notice";
  }, [message?.title]);

  const bodyText = useMemo(() => {
    if (typeof message?.content === "string" && message.content.trim().length > 0) {
      return message.content;
    }
    return "Something happened. Please try again.";
  }, [message?.content]);

  const closeText = useMemo(() => {
    if (typeof message?.closeText === "string" && message.closeText.trim().length > 0) {
      return message.closeText;
    }
    return "Close";
  }, [message?.closeText]);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const previousFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousFocusedRef.current = previousFocusedElement;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
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
  }, [message, onClose]);

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        dir="auto"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between">
          <h3
            id={titleId}
            className="pr-3 text-lg font-bold leading-tight text-ieee-700 [overflow-wrap:anywhere]"
          >
            {titleText}
          </h3>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-ieee-500 focus:ring-offset-2"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className="mb-6 max-h-[45vh] overflow-y-auto pr-1">
          <p
            id={descriptionId}
            className="text-sm leading-relaxed text-slate-700 [overflow-wrap:anywhere]"
          >
            {bodyText}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 w-full rounded-lg bg-ieee-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ieee-700 focus:outline-none focus:ring-2 focus:ring-ieee-500 focus:ring-offset-2"
        >
          {closeText}
        </button>
      </div>
    </div>
  );
};

MessageModal.propTypes = {
  message: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    closeText: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired
};

MessageModal.defaultProps = {
  message: null
};

export default MessageModal;
