import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => Promise<boolean>;
    signup: (name: string, email: string, password?: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string): Promise<boolean> => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const foundUser = users.find((u: User) => u.email === email);

                if (foundUser) {
                    localStorage.setItem('currentUser', JSON.stringify(foundUser));
                    setUser(foundUser);
                    setIsAuthenticated(true);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500);
        });
    };

    const signup = async (name: string, email: string, password?: string): Promise<boolean> => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');

                // Check if user already exists
                if (users.some((u: User) => u.email === email)) {
                    resolve(false);
                    return;
                }

                const newUser = { id: crypto.randomUUID(), name, email };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // Auto login after signup
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                setUser(newUser);
                setIsAuthenticated(true);
                resolve(true);
            }, 500);
        });
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
