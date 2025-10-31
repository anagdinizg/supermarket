import { useState } from "react";
import { ShoppingCart, Users, Tag, LogOut, User, Package } from "lucide-react";
import { mockUsers, mockProducts } from "./services/mockData";
import LoginPage from "./components/LoginPage";
import ProductsPage from "./components/ProductsPage";
import PromotionsPage from "./components/PromotionsPage";
import UsersPage from "./components/UsersPage";
import Modal from "./components/Modal";
import ConfirmModal from "./components/ConfirmModal";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [loggedUser, setLoggedUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [products, setProducts] = useState(mockProducts);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Estado do modal de confirmação
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleLogin = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setLoggedUser(user);
      setCurrentPage("products");
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setLoggedUser(null);
    setCurrentPage("login");
  };

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now(), promotionalPrice: null };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const confirmDeleteProduct = (product) => {
    setConfirmModal({
      isOpen: true,
      title: "Excluir Produto",
      message: `Deseja realmente excluir "${product.name}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => deleteProduct(product.id),
    });
  };

  const applyPromotion = (id, promotionalPrice) => {
    updateProduct(id, { promotionalPrice: parseFloat(promotionalPrice) });
  };

  const removePromotion = (id) => {
    updateProduct(id, { promotionalPrice: null });
  };

  const confirmRemovePromotion = (product) => {
    setConfirmModal({
      isOpen: true,
      title: "Remover Promoção",
      message: `Deseja remover a promoção de "${product.name}"?`,
      onConfirm: () => removePromotion(product.id),
    });
  };

  const addUser = (user) => {
    const newUser = { ...user, id: Date.now() };
    setUsers([...users, newUser]);
  };

  const updateUser = (id, updatedUser) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)));
  };

  const deleteUser = (id) => {
    if (id === loggedUser?.id) {
      setConfirmModal({
        isOpen: true,
        title: "Ação Não Permitida",
        message: "Você não pode excluir seu próprio usuário!",
        onConfirm: () => {},
      });
      return;
    }
    setUsers(users.filter((u) => u.id !== id));
  };

  const confirmDeleteUser = (user) => {
    if (user.id === loggedUser?.id) {
      setConfirmModal({
        isOpen: true,
        title: "Ação Não Permitida",
        message: "Você não pode excluir seu próprio usuário!",
        onConfirm: () => {},
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: "Excluir Usuário",
      message: `Deseja realmente excluir "${user.name}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => deleteUser(user.id),
    });
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
    });
  };

  if (!loggedUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                <ShoppingCart
                  size={20}
                  className="text-white"
                  strokeWidth={1.5}
                />
              </div>
              <h1 className="text-xl font-medium text-zinc-900">
                Supermercado Bom Preço
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-zinc-600">
                <User size={16} strokeWidth={1.5} />
                <span>{loggedUser.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm text-zinc-600 hover:text-zinc-900 transition"
              >
                <LogOut size={16} strokeWidth={1.5} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setCurrentPage("products")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
              currentPage === "products"
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            <Package size={18} strokeWidth={1.5} />
            <span>Produtos</span>
          </button>
          <button
            onClick={() => setCurrentPage("promotions")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
              currentPage === "promotions"
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            <Tag size={18} strokeWidth={1.5} />
            <span>Promoções</span>
          </button>
          <button
            onClick={() => setCurrentPage("users")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
              currentPage === "users"
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            <Users size={18} strokeWidth={1.5} />
            <span>Usuários</span>
          </button>
        </div>

        {currentPage === "products" && (
          <ProductsPage
            products={products}
            onAdd={() => openModal("addProduct")}
            onEdit={(product) => openModal("editProduct", product)}
            onDelete={confirmDeleteProduct}
          />
        )}
        {currentPage === "promotions" && (
          <PromotionsPage
            products={products}
            onApplyPromotion={applyPromotion}
            onRemovePromotion={confirmRemovePromotion}
          />
        )}
        {currentPage === "users" && (
          <UsersPage
            users={users}
            onAdd={() => openModal("addUser")}
            onEdit={(user) => openModal("editUser", user)}
            onDelete={confirmDeleteUser}
            onView={(user) => openModal("viewUser", user)}
          />
        )}
      </div>

      {showModal && (
        <Modal
          type={modalType}
          item={selectedItem}
          onClose={closeModal}
          onSave={(data) => {
            if (modalType === "addProduct") addProduct(data);
            else if (modalType === "editProduct")
              updateProduct(selectedItem.id, data);
            else if (modalType === "addUser") addUser(data);
            else if (modalType === "editUser")
              updateUser(selectedItem.id, data);
            closeModal();
          }}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
}

export default App;
