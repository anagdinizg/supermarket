import { useState } from "react";
import {
  ShoppingCart,
  Users,
  Tag,
  LogOut,
  User,
  Package,
  UserCircle,
} from "lucide-react";
import { mockUsers, mockProducts, mockCustomers } from "./services/mockData";
import LoginPage from "./components/LoginPage";
import ProductsPage from "./components/ProductsPage";
import PromotionsPage from "./components/PromotionsPage";
import UsersPage from "./components/UsersPage";
import CustomersPage from "./components/CustomersPage";
import Modal from "./components/Modal";
import Toast from "./components/Toast";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [loggedUser, setLoggedUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [products, setProducts] = useState(mockProducts);
  const [customers, setCustomers] = useState(mockCustomers);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleLogin = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setLoggedUser(user);
      setCurrentPage("products");
      showToast(`Bem-vindo, ${user.name}!`, "success");
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setLoggedUser(null);
    setCurrentPage("login");
  };

  // Products
  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now(), promotionalPrice: null };
    setProducts([...products, newProduct]);
    showToast(`Produto "${product.name}" adicionado com sucesso!`, "success");
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
    showToast(
      `Produto "${updatedProduct.name}" atualizado com sucesso!`,
      "success"
    );
  };

  const deleteProduct = (id) => {
    const product = products.find((p) => p.id === id);
    setProducts(products.filter((p) => p.id !== id));
    showToast(`Produto "${product.name}" excluído com sucesso!`, "success");
  };

  const applyPromotion = (id, promotionalPrice) => {
    const product = products.find((p) => p.id === id);
    updateProduct(id, { promotionalPrice: parseFloat(promotionalPrice) });
    showToast(`Promoção aplicada em "${product.name}"!`, "success");
  };

  const removePromotion = (id) => {
    const product = products.find((p) => p.id === id);
    updateProduct(id, { promotionalPrice: null });
    showToast(`Promoção removida de "${product.name}"!`, "success");
  };

  // Users
  const addUser = (user) => {
    const newUser = { ...user, id: Date.now() };
    setUsers([...users, newUser]);
    showToast(`Usuário "${user.name}" adicionado com sucesso!`, "success");
  };

  const updateUser = (id, updatedUser) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)));
    showToast(
      `Usuário "${updatedUser.name}" atualizado com sucesso!`,
      "success"
    );
  };

  const deleteUser = (user) => {
    if (user.id === loggedUser?.id) {
      showToast("Você não pode excluir seu próprio usuário!", "error");
      return;
    }
    setUsers(users.filter((u) => u.id !== user.id));
  };

  // Customers
  const addCustomer = (customer) => {
    const newCustomer = { ...customer, id: Date.now() };
    setCustomers([...customers, newCustomer]);
    showToast(`Cliente "${customer.name}" adicionado com sucesso!`, "success");
  };

  const updateCustomer = (id, updatedCustomer) => {
    setCustomers(
      customers.map((c) => (c.id === id ? { ...c, ...updatedCustomer } : c))
    );
    showToast(
      `Cliente "${updatedCustomer.name}" atualizado com sucesso!`,
      "success"
    );
  };

  const deleteCustomer = (customer) => {
    setCustomers(customers.filter((c) => c.id !== customer.id));
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

  if (!loggedUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
              <h1 className="text-xl font-light text-zinc-900">SuperMercado</h1>
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
            <span>Funcionários</span>
          </button>
          <button
            onClick={() => setCurrentPage("customers")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
              currentPage === "customers"
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            <UserCircle size={18} strokeWidth={1.5} />
            <span>Clientes</span>
          </button>
        </div>

        {currentPage === "products" && (
          <ProductsPage
            products={products}
            onAdd={() => openModal("addProduct")}
            onEdit={(product) => openModal("editProduct", product)}
            onDelete={deleteProduct}
          />
        )}
        {currentPage === "promotions" && (
          <PromotionsPage
            products={products}
            onApplyPromotion={applyPromotion}
            onRemovePromotion={removePromotion}
          />
        )}
        {currentPage === "users" && (
          <UsersPage
            users={users}
            onAdd={() => openModal("addUser")}
            onEdit={(user) => openModal("editUser", user)}
            onDelete={deleteUser}
            onView={(user) => openModal("viewUser", user)}
          />
        )}
        {currentPage === "customers" && (
          <CustomersPage
            customers={customers}
            onAdd={() => openModal("addCustomer")}
            onEdit={(customer) => openModal("editCustomer", customer)}
            onDelete={deleteCustomer}
            onView={(customer) => openModal("viewCustomer", customer)}
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
            else if (modalType === "addCustomer") addCustomer(data);
            else if (modalType === "editCustomer")
              updateCustomer(selectedItem.id, data);
            closeModal();
          }}
        />
      )}
    </div>
  );
}

export default App;
