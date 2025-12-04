import { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import authService from "./services/authService";
import userService from "./services/userService";
import productService from "./services/productService";
import customerService from "./services/customerService";

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, type: null, data: null });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await authService.getMe();
          setLoggedUser(userData);

          await loadInitialData();
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loadInitialData = async () => {
    try {
      const [usersData, productsData, customersData] = await Promise.all([
        userService.getAll().catch(() => []),
        productService.getAll().catch(() => []),
        customerService.getAll().catch(() => []),
      ]);

      setUsers(usersData);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      const userData = await authService.login(email, password);
      setLoggedUser(userData.user);

      await loadInitialData();

      showToast("Login realizado com sucesso!", "success");
      return true;
    } catch (error) {
      showToast(error, "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (navigate) => {
    setIsLoading(true);
    setTimeout(() => {
      authService.logout();
      setLoggedUser(null);
      setUsers([]);
      setProducts([]);
      setCustomers([]);
      setIsLoading(false);
      if (navigate) navigate("/login");
    }, 500);
  };

  return (
    <AppRoutes
      loggedUser={loggedUser}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      users={users}
      setUsers={setUsers}
      products={products}
      setProducts={setProducts}
      customers={customers}
      setCustomers={setCustomers}
      modal={modal}
      setModal={setModal}
      toast={toast}
      showToast={showToast}
      isLoading={isLoading}
    />
  );
}

export default App;
