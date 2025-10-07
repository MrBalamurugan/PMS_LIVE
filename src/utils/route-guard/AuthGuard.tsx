import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// project import

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }: any) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("login", {
        state: {
          from: location.pathname,
        },
        replace: true,
      });
      navigate("login", { replace: true });
    }
  }, [isLoggedIn, navigate, location]);

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;
