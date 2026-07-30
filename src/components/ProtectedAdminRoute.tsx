import { Navigate } from "react-router-dom";

type ProtectedAdminRouteProps = {
  children: React.ReactNode;
};

function ProtectedAdminRoute({
  children,
}: ProtectedAdminRouteProps) {
  const isAdminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

  if (!isAdminLoggedIn) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedAdminRoute;