import { X, AlertTriangle } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-zinc-200">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle
                size={24}
                className="text-amber-600"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-zinc-900 mb-1">
                {title}
              </h3>
              <p className="text-sm text-zinc-600">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <div className="flex space-x-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium py-3 rounded-xl transition text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition text-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
