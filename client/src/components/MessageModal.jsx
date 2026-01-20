import PropTypes from "prop-types";

const MessageModal = ({ message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-bold text-ieee-600">{message.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close message"
          >
            ×
          </button>
        </div>
        <p className="mb-6 text-sm text-slate-600">{message.content}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg bg-ieee-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ieee-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

MessageModal.propTypes = {
  message: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }),
  onClose: PropTypes.func.isRequired
};

MessageModal.defaultProps = {
  message: null
};

export default MessageModal;
