import {
  Home,
  Package,
  UserRound,
  UsersRound,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import "../css/BottomNav.css";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: "Home",
      path: "/home",
      icon: <Home size={21} />,
    },
    {
      label: "Products",
      path: "/products",
      icon: <Package size={21} />,
    },
    {
      label: "Promotion",
      path: "/promotion",
      icon: <UsersRound size={21} />,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <UserRound size={21} />,
    },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.path}
          type="button"
          className={`nav-button ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;