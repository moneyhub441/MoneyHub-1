import {
  Navigate,
  useLocation,
} from "react-router-dom";

type ProtectedUserRouteProps = {
  children: React.ReactNode;
};

function ProtectedUserRoute({
  children,
}: ProtectedUserRouteProps) {
  const location = useLocation();

  try {
    const loggedIn =
      localStorage.getItem(
        "userLoggedIn"
      ) === "true";

    const savedUser =
      localStorage.getItem(
        "currentUser"
      );

    if (!loggedIn || !savedUser) {
      return (
        <Navigate
          to="/login"
          replace
          state={{
            from: location.pathname,
          }}
        />
      );
    }

    const user =
      JSON.parse(savedUser);

    if (!user?.id) {
      localStorage.removeItem(
        "currentUser"
      );

      localStorage.removeItem(
        "userLoggedIn"
      );

      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }

    return <>{children}</>;
  } catch {
    localStorage.removeItem(
      "currentUser"
    );

    localStorage.removeItem(
      "userLoggedIn"
    );

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }
}

export default ProtectedUserRoute;