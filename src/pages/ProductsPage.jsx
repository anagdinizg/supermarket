import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Info,
  X,
  AlertTriangle,
  Package,
  Plus,
} from "lucide-react";

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

const ProductsPage = ({ products, onAdd, onEdit, onDelete }) => {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    product: null,
  });

  const handleAdd = () => {
    onAdd();
  };

  const handleEdit = (product) => {
    onEdit(product);
  };

  const handleDeleteClick = (product) => {
    setConfirmModal({ isOpen: true, product });
  };

  const handleDeleteConfirm = () => {
    if (confirmModal.product) {
      onDelete(confirmModal.product);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, product: null })}
        onConfirm={handleDeleteConfirm}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir "${confirmModal.product?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-zinc-900">Produtos</h2>
            <p className="text-sm text-zinc-500 mt-1">
              {products.length} produtos cadastrados
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-zinc-50 transition">
                  <td className="px-4 py-4 text-sm font-medium text-zinc-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-600 max-w-xs">
                    <div className="truncate" title={product.description}>
                      {product.description || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-600">
                    {product.category || "-"}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex flex-col">
                      {product.hasPromotion ? (
                        <>
                          <span className="text-zinc-400 line-through text-xs">
                            R$ {product.price.toFixed(2)}
                          </span>
                          <span className="text-emerald-600 font-bold">
                            R$ {product.finalPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-zinc-900 font-medium">
                          R$ {product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`${
                        product.stock <= 0
                          ? "text-red-600 font-medium"
                          : product.stock <= 10
                          ? "text-amber-600 font-medium"
                          : "text-zinc-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit2 size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="p-1.5 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Excluir"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <Package
              size={48}
              className="mx-auto text-zinc-300 mb-3"
              strokeWidth={1.5}
            />
            <p className="text-zinc-500">Nenhum produto cadastrado</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;
