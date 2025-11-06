import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type User = { id: string; email: string };
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("sponto_token");
        const email = await AsyncStorage.getItem("sponto_email");
        if (token && email) setUser({ id: "u1", email });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    // mock: valid keď má aspoň 6 znakov
    if (!email.includes("@") || password.length < 6) {
      throw new Error("Nesprávne prihlasovacie údaje");
    }
    await AsyncStorage.setItem("sponto_token", "mock-token-123");
    await AsyncStorage.setItem("sponto_email", email);
    setUser({ id: "u1", email });
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(["sponto_token", "sponto_email"]);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
