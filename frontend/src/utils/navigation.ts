import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../routes/routes";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToUserDetail = (userId: string) => {
    navigate(ROUTES.USER_DETAIL.replace(":id", userId));
  };

  const goToProductDetail = (productId: string) => {
    navigate(ROUTES.PRODUCT_DETAIL.replace(":id", productId));
  };

  const goBack = () => {
    navigate(-1);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return {
    goToUserDetail,
    goToProductDetail,
    goBack,
    isActive,
    navigate,
  };
};
