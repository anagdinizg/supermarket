import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, User, X, AlertTriangle } from "lucide-react";

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

const UsersPage = ({ users = [], onAdd, onEdit, onDelete, onView }) => {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    user: null,
  });

  const handleAdd = () => {
    onAdd();
  };

  const handleView = (user) => {
    onView(user);
  };

  const handleEdit = (user) => {
    onEdit(user);
  };

  const handleDeleteClick = (user) => {
    setConfirmModal({ isOpen: true, user });
  };

  const handleDeleteConfirm = () => {
    if (confirmModal.user) {
      onDelete(confirmModal.user);
      setConfirmModal({ isOpen: false, user: null });
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, user: null })}
        onConfirm={handleDeleteConfirm}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir "${confirmModal.user?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-zinc-900">Usuários</h2>
            <p className="text-sm text-zinc-500 mt-1">
              {users?.length || 0} funcionários cadastrados
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
          {users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="border border-zinc-200 rounded-xl p-5 hover:border-zinc-300 transition"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                    {user.profileImage ? (
                      <img
                        src={`http://localhost:3001${user.profileImage}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User
                          size={20}
                          className="text-zinc-600"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-zinc-900 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-zinc-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-zinc-600 truncate">{user.email}</p>
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
                    onClick={() => handleDeleteClick(user)}
                    className="flex items-center justify-center bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm transition border border-zinc-200 hover:border-red-200"
                    title="Excluir usuário"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <User
                size={48}
                className="mx-auto text-zinc-300 mb-3"
                strokeWidth={1.5}
              />
              <p className="text-zinc-500">Nenhum usuário cadastrado</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersPage;
