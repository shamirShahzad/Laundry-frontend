import { createContext, useContext, useState } from "react";
import { API } from "@/lib/utils/Axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me", { withCredentials: true });
      console.log(res);
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    await fetchUser();
  };

  const logout = () => {
    setUser(null);
    document.cookie = "token=; Max-Age=0; path=/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth needs to be used within AuthProvider");
  return context;
};
