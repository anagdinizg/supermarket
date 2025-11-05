import { useState } from "react";
import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Users,
  Tag,
  LogOut,
  User,
  Package,
  UserCircle,
} from "lucide-react";

import ProductsPage from "../components/ProductsPage";
import PromotionsPage from "../components/PromotionsPage";
import UsersPage from "../components/UsersPage";
import CustomersPage from "../components/CustomersPage";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

const AuthenticatedLayout = ({
  loggedUser,
  handleLogout,
  users,
  setUsers,
  products,
  setProducts,
  customers,
  setCustomers,
}) => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, type: null, data: null });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  // Usuários
  const handleAddUser = () =>
    setModal({ show: true, type: "addUser", data: null });
  const handleEditUser = (user) =>
    setModal({ show: true, type: "editUser", data: user });
  const handleDeleteUser = (user) => {
    setUsers(users.filter((u) => u.id !== user.id));
    showToast(`Usuário "${user.name}" excluído com sucesso!`, "success");
  };
  const handleViewUser = (user) =>
    setModal({ show: true, type: "viewUser", data: user });

  // Clientes
  const handleAddCustomer = () =>
    setModal({ show: true, type: "addCustomer", data: null });
  const handleEditCustomer = (customer) =>
    setModal({ show: true, type: "editCustomer", data: customer });
  const handleDeleteCustomer = (customer) => {
    setCustomers(customers.filter((c) => c.id !== customer.id));
    showToast(`Cliente "${customer.name}" excluído com sucesso!`, "success");
  };
  const handleViewCustomer = (customer) =>
    setModal({ show: true, type: "viewCustomer", data: customer });

  // Produtos
  const handleAddProduct = () =>
    setModal({ show: true, type: "addProduct", data: null });
  const handleEditProduct = (product) =>
    setModal({ show: true, type: "editProduct", data: product });
  const handleDeleteProduct = (product) => {
    setProducts(products.filter((p) => p.id !== product.id));
    showToast(`Produto "${product.name}" excluído com sucesso!`, "success");
  };

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 p-4 flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <Package size={28} className="text-zinc-800" strokeWidth={1.5} />
          <h1 className="text-lg font-semibold">Painel de Controle</h1>
        </div>
        <nav className="flex-1 space-y-1">
          <NavButton
            to="/products"
            icon={<ShoppingCart size={18} />}
            label="Produtos"
          />
          <NavButton
            to="/promotions"
            icon={<Tag size={18} />}
            label="Promoções"
          />
          <NavButton to="/users" icon={<User size={18} />} label="Usuários" />
          <NavButton
            to="/customers"
            icon={<Users size={18} />}
            label="Clientes"
          />
        </nav>
        <div className="mt-auto border-t border-zinc-200 pt-4">
          <div className="flex items-center space-x-3 mb-4">
            <UserCircle size={28} className="text-zinc-500" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium">{loggedUser.name}</p>
              <p className="text-xs text-zinc-500">{loggedUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => handleLogout(navigate)}
            className="flex items-center w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} className="mr-2" strokeWidth={1.5} /> Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route
            path="/products"
            element={
              <ProductsPage
                products={products}
                onAdd={handleAddProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                showToast={showToast}
              />
            }
          />
          <Route
            path="/promotions"
            element={
              <PromotionsPage
                products={products}
                onApplyPromotion={(id, price) =>
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === id
                        ? { ...p, promotionalPrice: parseFloat(price) }
                        : p
                    )
                  )
                }
                onRemovePromotion={(product) =>
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.id === product.id ? { ...p, promotionalPrice: null } : p
                    )
                  )
                }
                showToast={showToast}
              />
            }
          />
          <Route
            path="/users"
            element={
              <UsersPage
                users={users}
                onAdd={handleAddUser}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onView={handleViewUser}
                showToast={showToast}
              />
            }
          />
          <Route
            path="/customers"
            element={
              <CustomersPage
                customers={customers}
                onAdd={handleAddCustomer}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
                onView={handleViewCustomer}
                showToast={showToast}
              />
            }
          />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>

      {modal.show && (
        <Modal
          type={modal.type}
          item={modal.data}
          onClose={() => setModal({ show: false, type: null, data: null })}
          onSave={(data) => {
            switch (modal.type) {
              case "addUser":
                setUsers([...users, { ...data, id: Date.now() }]);
                showToast("Usuário adicionado com sucesso!", "success");
                break;
              case "editUser":
                setUsers(users.map((u) => (u.id === data.id ? data : u)));
                showToast("Usuário atualizado com sucesso!", "success");
                break;
              case "addCustomer":
                setCustomers([...customers, { ...data, id: Date.now() }]);
                showToast("Cliente adicionado com sucesso!", "success");
                break;
              case "editCustomer":
                setCustomers(
                  customers.map((c) => (c.id === data.id ? data : c))
                );
                showToast("Cliente atualizado com sucesso!", "success");
                break;
              case "addProduct":
                setProducts([...products, { ...data, id: Date.now() }]);
                showToast("Produto adicionado com sucesso!", "success");
                break;
              case "editProduct":
                setProducts(products.map((p) => (p.id === data.id ? data : p)));
                showToast("Produto atualizado com sucesso!", "success");
                break;
              default:
                break;
            }
            setModal({ show: false, type: null, data: null });
          }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const NavButton = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center w-full px-3 py-2 rounded-lg text-sm transition hover:bg-zinc-100 text-zinc-700"
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Link>
);

export default AuthenticatedLayout;
