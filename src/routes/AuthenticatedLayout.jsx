import { useState, useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  ShoppingCart,
  Users,
  LogOut,
  User,
  Package,
  UserCircle,
} from "lucide-react";

import ProductsPage from "../pages/ProductsPage";
import UsersPage from "../pages/UsersPage";
import CustomersPage from "../pages/CustomersPage";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

import userService from "../services/userService";
import productService from "../services/productService";
import customerService from "../services/customerService";
import authService from "../services/authService";

const AuthenticatedLayout = ({ loggedUser, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modal, setModal] = useState({ show: false, type: null, data: null });
  const [toast, setToast] = useState(null);

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (location.pathname === "/products") {
      loadProducts();
    } else if (location.pathname === "/users") {
      loadUsers();
    } else if (location.pathname === "/customers") {
      loadCustomers();
    }
  }, [location.pathname]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [usersData, productsData, customersData] = await Promise.all([
        userService.getAll().catch(() => []),
        productService.getAll().catch(() => []),
        customerService.getAll().catch(() => []),
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setUsers([]);
      setProducts([]);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await productService.getAll().catch(() => []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProducts([]);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await userService.getAll().catch(() => []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setUsers([]);
    }
  };

  const loadCustomers = async () => {
    try {
      const customersData = await customerService.getAll().catch(() => []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      setCustomers([]);
    }
  };
  const handleAddUser = () =>
    setModal({ show: true, type: "addUser", data: null });

  const handleEditUser = (user) =>
    setModal({ show: true, type: "editUser", data: user });

  const handleDeleteUser = async (user) => {
    try {
      await userService.delete(user._id);
      await loadUsers();
      showToast(`Usuário "${user.name}" excluído com sucesso!`, "success");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Erro ao excluir usuário";
      showToast(errorMessage, "error");
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const handleViewUser = (user) =>
    setModal({ show: true, type: "viewUser", data: user });

  const handleAddCustomer = () =>
    setModal({ show: true, type: "addCustomer", data: null });

  const handleEditCustomer = (customer) =>
    setModal({ show: true, type: "editCustomer", data: customer });

  const handleDeleteCustomer = async (customer) => {
    try {
      await customerService.delete(customer._id);
      await loadCustomers();
      showToast(`Cliente "${customer.name}" excluído com sucesso!`, "success");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Erro ao excluir cliente";
      showToast(errorMessage, "error");
      console.error("Erro ao excluir cliente:", error);
    }
  };

  const handleViewCustomer = (customer) =>
    setModal({ show: true, type: "viewCustomer", data: customer });

  const handleAddProduct = () =>
    setModal({ show: true, type: "addProduct", data: null });

  const handleEditProduct = (product) =>
    setModal({ show: true, type: "editProduct", data: product });

  const handleDeleteProduct = async (product) => {
    try {
      await productService.delete(product._id);
      await loadProducts();
      showToast(`Produto "${product.name}" excluído com sucesso!`, "success");
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Erro ao excluir produto";
      showToast(errorMessage, "error");
      console.error("Erro ao excluir produto:", error);
    }
  };

  const handleModalSave = async (data) => {
    try {
      switch (modal.type) {
        case "addUser":
          await authService.register({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role.toLowerCase(),
          });
          showToast("Usuário adicionado com sucesso!", "success");
          await loadUsers();
          break;

        case "editUser":
          await userService.update(data._id, {
            name: data.name,
            email: data.email,
            role: data.role.toLowerCase(),
          });
          showToast("Usuário atualizado com sucesso!", "success");
          await loadUsers();
          break;

        case "addCustomer":
          await customerService.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            cpf: data.cpf,
            address: data.address,
          });
          showToast("Cliente adicionado com sucesso!", "success");
          await loadCustomers();
          break;

        case "editCustomer":
          await customerService.update(data._id, {
            name: data.name,
            email: data.email,
            phone: data.phone,
            cpf: data.cpf,
            address: data.address,
          });
          showToast("Cliente atualizado com sucesso!", "success");
          await loadCustomers();
          break;

        case "addProduct":
          await productService.create({
            name: data.name,
            description: data.description,
            price: data.price,
            promotionalPrice: data.promotionalPrice || null,
            stock: data.stock,
            category: data.category,
          });
          showToast("Produto adicionado com sucesso!", "success");
          await loadProducts();
          break;

        case "editProduct":
          await productService.update(data._id, {
            name: data.name,
            description: data.description,
            price: data.price,
            promotionalPrice: data.promotionalPrice || null,
            stock: data.stock,
            category: data.category,
          });
          showToast("Produto atualizado com sucesso!", "success");
          await loadProducts();
          break;

        default:
          break;
      }
      setModal({ show: false, type: null, data: null });
    } catch (error) {
      console.error("Erro ao salvar:", error);

      let errorMessage = "Erro ao salvar dados";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (
        errorMessage.includes("E11000") ||
        errorMessage.includes("duplicate key")
      ) {
        if (errorMessage.includes("email")) {
          errorMessage = "Email já cadastrado";
        } else if (errorMessage.includes("cpf")) {
          errorMessage = "CPF já cadastrado";
        } else {
          errorMessage = "Dados duplicados no sistema";
        }
      }

      const errorLower = errorMessage.toLowerCase();

      if (
        errorLower.includes("email já cadastrado") ||
        errorLower.includes("email já existe")
      ) {
        errorMessage = "Este email já está cadastrado no sistema";
      } else if (
        errorLower.includes("cpf já cadastrado") ||
        errorLower.includes("cpf já existe")
      ) {
        errorMessage = "Este CPF já está cadastrado no sistema";
      } else if (errorLower.includes("dados duplicados")) {
        errorMessage = "Estes dados já estão cadastrados no sistema";
      } else if (
        errorLower.includes("network") ||
        errorLower.includes("conexão")
      ) {
        errorMessage = "Erro de conexão com o servidor";
      } else if (
        errorLower.includes("não autorizado") ||
        errorLower.includes("unauthorized")
      ) {
        errorMessage = "Você não tem permissão para realizar esta ação";
      } else if (
        errorLower.includes("not found") ||
        errorLower.includes("não encontrado")
      ) {
        errorMessage = "Registro não encontrado";
      } else if (errorLower.includes("timeout")) {
        errorMessage = "Tempo de resposta esgotado. Tente novamente";
      } else if (errorLower.includes("nome e email são obrigatórios")) {
        errorMessage = "Preencha todos os campos obrigatórios";
      }

      showToast(errorMessage, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-zinc-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-50 text-zinc-900">
      <aside className="hidden md:flex w-64 bg-white border-r border-zinc-200 p-4 flex-col">
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
              <p className="text-sm font-medium">{loggedUser?.name}</p>
              <p className="text-xs text-zinc-500 capitalize">
                {loggedUser?.role}
              </p>
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

      <header className="md:hidden bg-white border-b border-zinc-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package size={24} className="text-zinc-800" strokeWidth={1.5} />
          <h1 className="text-base font-semibold">Painel de Controle</h1>
        </div>
        <button
          onClick={() => handleLogout(navigate)}
          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} strokeWidth={1.5} />
        </button>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
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
          onSave={handleModalSave}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-around items-center h-16 z-10">
        <MobileNavButton
          to="/products"
          icon={<ShoppingCart size={22} />}
          label="Produtos"
        />
        <MobileNavButton
          to="/users"
          icon={<User size={22} />}
          label="Usuários"
        />
        <MobileNavButton
          to="/customers"
          icon={<Users size={22} />}
          label="Clientes"
        />
      </nav>
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

const MobileNavButton = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center flex-1 h-full text-zinc-600 hover:text-zinc-900 transition"
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default AuthenticatedLayout;
