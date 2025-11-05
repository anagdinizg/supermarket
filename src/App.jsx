import { useState } from "react";
import { mockUsers, mockProducts, mockCustomers } from "./services/mockData";
import AppRoutes from "./routes/appRoutes";

const App = () => {
  const [users, setUsers] = useState(mockUsers);
  const [products, setProducts] = useState(mockProducts);
  const [customers, setCustomers] = useState(mockCustomers);
  const [loggedUser, setLoggedUser] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [modal, setModal] = useState({ show: false, type: "", data: null });
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      3000
    );
  };

  const handleLogin = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setIsLoading(true);
      setTimeout(() => {
        setLoggedUser(user);
        showToast(`Bem-vindo, ${user.name}!`, "success");
        setIsLoading(false);
      }, 1000);
      return true;
    }
    return false;
  };

  const handleLogout = (navigate) => {
    setIsLoading(true);
    setTimeout(() => {
      setLoggedUser(null);
      navigate("/login");
      setIsLoading(false);
    }, 800);
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
      setToast={setToast}
      showToast={showToast}
      isLoading={isLoading}
    />
  );
};

export default App;
