import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Loading from "../components/Loading";
import AuthenticatedLayout from "./AuthenticatedLayout";

const AppRoutes = ({
  loggedUser,
  handleLogin,
  handleLogout,
  users,
  setUsers,
  products,
  setProducts,
  customers,
  setCustomers,
  modal,
  setModal,
  toast,
  showToast,
  isLoading,
}) => {
  if (isLoading) {
    const message = loggedUser
      ? "Saindo do sistema..."
      : "Entrando no sistema...";
    return <Loading message={message} />;
  }

  return (
    <Router>
      {!loggedUser ? (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <AuthenticatedLayout
          loggedUser={loggedUser}
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
        />
      )}
    </Router>
  );
};

export default AppRoutes;
