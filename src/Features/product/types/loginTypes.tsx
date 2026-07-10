// File: src/Features/product/types/loginTypes.tsx

// Tipe data untuk Props yang diterima oleh ComponentLogin
export interface ComponentLoginProps {
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

// Tipe data untuk nilai yang dikembalikan oleh Custom Hook useLoginState
export interface LoginHookReturn {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  handleAddToCart: () => void;
}

const LoginTypeDefinitions = () => null;
export default LoginTypeDefinitions;