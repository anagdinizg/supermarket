import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  UserCircle,
  CheckCircle,
  XCircle,
  Info,
  X,
  AlertTriangle,
  Clock,
  Calendar,
} from "lucide-react";
import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} strokeWidth={1.5} />,
    error: <XCircle size={20} strokeWidth={1.5} />,
    info: <Info size={20} strokeWidth={1.5} />,
  };

  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-lg ${styles[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition">
        <X size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
};

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

const calculateCustomerTime = (customerSinceDate) => {
  const startDate = new Date(customerSinceDate);
  const currentDate = new Date();

  const years = currentDate.getFullYear() - startDate.getFullYear();
  const months = currentDate.getMonth() - startDate.getMonth();

  let totalMonths = years * 12 + months;

  if (totalMonths < 1) {
    return "Menos de 1 mês";
  } else if (totalMonths < 12) {
    return `${totalMonths} ${totalMonths === 1 ? "mês" : "meses"}`;
  } else {
    const fullYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    if (remainingMonths === 0) {
      return `${fullYears} ${fullYears === 1 ? "ano" : "anos"}`;
    } else {
      return `${fullYears} ${
        fullYears === 1 ? "ano" : "anos"
      } e ${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`;
    }
  }
};

const CustomersPage = ({ customers, onAdd, onEdit, onDelete, onView }) => {
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    customer: null,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleAdd = () => {
    onAdd();
    showToast("Abrindo formulário de cadastro", "info");
  };

  const handleView = (customer) => {
    onView(customer);
    showToast(`Visualizando detalhes de ${customer.name}`, "info");
  };

  const handleEdit = (customer) => {
    onEdit(customer);
    showToast(`Editando "${customer.name}"`, "info");
  };

  const handleDeleteClick = (customer) => {
    setConfirmModal({
      isOpen: true,
      customer,
    });
  };

  const handleDeleteConfirm = () => {
    if (confirmModal.customer) {
      onDelete(confirmModal.customer);
      showToast(
        `Cliente "${confirmModal.customer.name}" excluído com sucesso!`,
        "success"
      );
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, customer: null })}
        onConfirm={handleDeleteConfirm}
        title="Excluir Cliente"
        message={`Tem certeza que deseja excluir "${confirmModal.customer?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-zinc-900">Clientes</h2>
            <p className="text-sm text-zinc-500 mt-1">
              {customers.length} clientes cadastrados
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl transition text-sm font-medium"
          >
            <Plus size={18} strokeWidth={1.5} />
            <span>Adicionar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition"
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserCircle
                    size={20}
                    className="text-blue-600"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-zinc-900 truncate">
                    {customer.name}
                  </h3>
                  <p className="text-sm text-zinc-500">{customer.age} anos</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-zinc-600">
                  <span className="font-medium">CPF:</span>
                  <span>{customer.cpf}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-zinc-600">
                  <Clock
                    size={14}
                    strokeWidth={1.5}
                    className="text-zinc-400"
                  />
                  <span className="text-xs">
                    Cliente há {calculateCustomerTime(customer.customerSince)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-zinc-600">
                  <Calendar
                    size={14}
                    strokeWidth={1.5}
                    className="text-zinc-400"
                  />
                  <span className="text-xs">
                    Desde{" "}
                    {new Date(customer.customerSince).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(customer)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 px-3 py-2 rounded-lg text-sm transition border border-zinc-200"
                  title="Visualizar detalhes"
                >
                  <Eye size={14} strokeWidth={1.5} />
                  <span>Ver</span>
                </button>
                <button
                  onClick={() => handleEdit(customer)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 px-3 py-2 rounded-lg text-sm transition border border-zinc-200"
                  title="Editar cliente"
                >
                  <Edit2 size={14} strokeWidth={1.5} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(customer)}
                  className="flex items-center justify-center bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm transition border border-zinc-200 hover:border-red-200"
                  title="Excluir cliente"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomersPage;
