import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  User,
  CheckCircle,
  XCircle,
  Info,
  X,
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

const UsersPage = ({ users, onAdd, onEdit, onDelete, onView }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleAdd = () => {
    onAdd();
    showToast("Abrindo formulário de cadastro", "info");
  };

  const handleView = (user) => {
    onView(user);
    showToast("Visualizando detalhes de " + user.name, "info");
  };

  const handleEdit = (user) => {
    onEdit(user);
    showToast("Editando usuário: " + user.name, "info");
  };

  const handleDelete = (user) => {
    const confirmed = window.confirm(
      `Deseja realmente excluir "${user.name}"?`
    );
    if (confirmed) {
      onDelete(user);
      showToast("Usuário excluído com sucesso!", "success");
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
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-zinc-900">Usuários</h2>
            <p className="text-sm text-zinc-500 mt-1">
              {users.length} funcionários cadastrados
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
          {users.map((user) => (
            <div
              key={user.id}
              className="border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition"
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-zinc-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-zinc-900 truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-zinc-500">{user.role}</p>
                </div>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-sm text-zinc-600 truncate">{user.email}</p>
                <p className="text-sm text-zinc-500">{user.cpf}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(user)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 px-3 py-2 rounded-lg text-sm transition border border-zinc-200"
                  title="Visualizar detalhes"
                >
                  <Eye size={14} strokeWidth={1.5} />
                  <span>Ver</span>
                </button>
                <button
                  onClick={() => handleEdit(user)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 px-3 py-2 rounded-lg text-sm transition border border-zinc-200"
                  title="Editar usuário"
                >
                  <Edit2 size={14} strokeWidth={1.5} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="flex items-center justify-center bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm transition border border-zinc-200 hover:border-red-200"
                  title="Excluir usuário"
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

export default UsersPage;
