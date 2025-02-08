import { createContext, useState, useEffect, useContext, ReactNode} from "react";

const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextType = {
    user: User | null,
    login: (data: AuthData) => void,
    logout: () => void,
};

type AuthData = {
    user: User | null,
    refresh: string,
    access: string
}

type User = {
    id: string,
    nickname: string,
    email: string,
    profile_picture: string | null
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        try{
            const storedUser = localStorage.getItem('user');
            if(storedUser){
                setUser(JSON.parse(storedUser));
            };
        }catch(err){
            console.log("Failed to parse user data", err);
        }
       
    }, [])

    const login = (data: AuthData) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setUser(data.user);
    }

    const logout = () => {
        // localStorage.removeItem('user');
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        localStorage.clear();
        setUser(null);
        
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    };
    return context;
  };