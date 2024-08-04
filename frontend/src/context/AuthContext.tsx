import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { User } from "../types";

export interface AuthState {
    user: User | null;
}

export interface AuthAction {
    type: "LOGIN" | "LOGOUT";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: User | null;
}

export const AuthContext = createContext<
    { state: AuthState; dispatch: Dispatch<AuthAction> } | undefined
>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    console.log("Auth reducer")
    console.log("Action")
    console.log(action)
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload || null }; // Provide a default value of null if action.payload is undefined
        case "LOGOUT":
            return { user: null };
        default:
            return state;
    }
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const session = localStorage.getItem("user");
    const user = session !== null ? JSON.parse(session) : null;

    const [state, dispatch] = useReducer(authReducer, {
        user: user,
    });

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
