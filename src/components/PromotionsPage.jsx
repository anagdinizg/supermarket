import { useState } from "react";
import { Tag, X, CheckCircle, XCircle, Info } from "lucide-react";
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

const PromotionsPage = ({ products, onApplyPromotion, onRemovePromotion }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [promotionalPrice, setPromotionalPrice] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!selectedProduct || !promotionalPrice) {
      showToast("Preencha todos os campos", "error");
      return;
    }
    const product = products.find((p) => p.id === parseInt(selectedProduct));
    const promo = parseFloat(promotionalPrice);

    if (promo >= product.price) {
      showToast(
        "O preço promocional deve ser menor que o preço normal",
        "error"
      );
      return;
    }

    onApplyPromotion(parseInt(selectedProduct), promotionalPrice);
    showToast("Promoção aplicada com sucesso!", "success");
    setSelectedProduct("");
    setPromotionalPrice("");
  };

  const handleRemovePromotion = (product) => {
    onRemovePromotion(product);
    showToast("Promoção removida com sucesso!", "success");
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-light text-zinc-900 mb-6">
            Aplicar Promoção
          </h2>
          <form onSubmit={handleApply} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Produto
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                required
              >
                <option value="">Selecione um produto...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - R$ {product.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Preço Promocional
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={promotionalPrice}
                onChange={(e) => setPromotionalPrice(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition text-sm"
                placeholder="0.00"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 rounded-xl transition text-sm"
            >
              Aplicar Promoção
            </button>
          </form>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-light text-zinc-900 mb-6">
            Promoções Ativas
          </h2>
          <div className="space-y-3">
            {products
              .filter((p) => p.promotionalPrice)
              .map((product) => (
                <div
                  key={product.id}
                  className="border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-zinc-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        {product.type}
                      </p>
                      <div className="mt-3 flex items-center space-x-3">
                        <span className="text-zinc-400 line-through text-sm">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span className="text-emerald-600 font-semibold text-lg">
                          R$ {product.promotionalPrice.toFixed(2)}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-1 rounded-lg">
                          {Math.round(
                            (1 - product.promotionalPrice / product.price) * 100
                          )}
                          % OFF
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemovePromotion(product)}
                      className="p-1.5 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition ml-4"
                      title="Remover promoção"
                    >
                      <X size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            {products.filter((p) => p.promotionalPrice).length === 0 && (
              <div className="text-center py-16">
                <Tag
                  size={40}
                  className="mx-auto text-zinc-300 mb-3"
                  strokeWidth={1.5}
                />
                <p className="text-zinc-500 text-sm">Nenhuma promoção ativa</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PromotionsPage;
