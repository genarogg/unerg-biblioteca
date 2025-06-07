"use client"

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';


// Tipos para el estado de autenticación
interface AuthState {
    token: string;
    rol: string;
    loading: boolean;
    isAuthenticated: boolean;
}

// Tipos para las acciones del reducer
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { token: string; rol: string } }
    | { type: 'LOGIN_FAILURE' }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'VERIFY_TOKEN_SUCCESS'; payload?: { rol: string } }
    | { type: 'VERIFY_TOKEN_FAILURE' };

// Función para verificar si localStorage está disponible
const isLocalStorageAvailable = (): boolean => {
    try {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch (error) {
        return false;
    }
};

// Función para obtener token desde localStorage
const getTokenFromStorage = (): string => {
    if (isLocalStorageAvailable()) {
        return localStorage.getItem('auth_token') || '';
    }
    return '';
};

// Función para obtener rol desde localStorage
const getRolFromStorage = (): string => {
    if (isLocalStorageAvailable()) {
        return localStorage.getItem('user_rol') || '';
    }
    return '';
};

// Función para guardar token en localStorage
const saveTokenToStorage = (token: string): void => {
    if (isLocalStorageAvailable()) {
        localStorage.setItem('auth_token', token);
    }
};

// Función para guardar rol en localStorage
const saveRolToStorage = (rol: string): void => {
    if (isLocalStorageAvailable()) {
        localStorage.setItem('user_rol', rol);
    }
};

// Función para eliminar token de localStorage
const removeTokenFromStorage = (): void => {
    if (isLocalStorageAvailable()) {
        localStorage.removeItem('auth_token');
    }
};

// Función para eliminar rol de localStorage
const removeRolFromStorage = (): void => {
    if (isLocalStorageAvailable()) {
        localStorage.removeItem('user_rol');
    }
};

// Estado inicial - obtiene el token y rol desde localStorage si está disponible
const initialState: AuthState = {
    token: '',
    rol: '',
    loading: true,
    isAuthenticated: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                loading: true,
            };

        case 'LOGIN_SUCCESS':
            // Guardar token y rol en localStorage
            saveTokenToStorage(action.payload.token);
            saveRolToStorage(action.payload.rol);
            return {
                ...state,
                token: action.payload.token,
                rol: action.payload.rol,
                loading: false,
                isAuthenticated: true,
            };

        case 'LOGIN_FAILURE':
            // Eliminar token y rol de localStorage en caso de fallo
            removeTokenFromStorage();
            removeRolFromStorage();
            return {
                ...state,
                token: '',
                rol: '',
                loading: false,
                isAuthenticated: false,
            };

        case 'LOGOUT':
            // Eliminar token y rol de localStorage al cerrar sesión
            removeTokenFromStorage();
            removeRolFromStorage();
            return {
                ...state,
                token: '',
                rol: '',
                loading: false,
                isAuthenticated: false,
            };

        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload,
            };

        case 'VERIFY_TOKEN_SUCCESS':
            return {
                ...state,
                rol: action.payload?.rol || state.rol,
                loading: false,
                isAuthenticated: true,
            };

        case 'VERIFY_TOKEN_FAILURE':
            // Eliminar token y rol de localStorage si la verificación falla
            removeTokenFromStorage();
            removeRolFromStorage();
            return {
                ...state,
                token: '',
                rol: '',
                loading: false,
                isAuthenticated: false,
            };

        default:
            return state;
    }
};

// Contexto
interface AuthContextType {
    state: AuthState;
    login: (tokenData: { token: string; rol: string }) => void;
    logout: () => void;
    verifyAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Provider del contexto
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [isClient, setIsClient] = React.useState(false);
    
    // Asegurar que estamos en el cliente antes de usar useRouter
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    // Función para iniciar sesión
    const login = (tokenData: { token: string; rol: string }) => {
        try {
            dispatch({ type: 'LOGIN_START' });

            // El token y rol se guardan automáticamente en localStorage a través del reducer
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token: tokenData.token, rol: tokenData.rol }
            });

            console.log('Login exitoso');

            // Navegar al dashboard después del login exitoso solo si estamos en el cliente
            if (isClient && typeof window !== 'undefined') {
                window.location.href = '/dashboard';
            }

        } catch (error) {
            console.error('Error en login:', error);
            dispatch({ type: 'LOGIN_FAILURE' });
            throw error;
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        console.log('Sesión cerrada');

        // Navegar al inicio después de cerrar sesión solo si estamos en el cliente
        if (isClient && typeof window !== 'undefined') {
            window.location.href = '/';
        }
    };

    // Función para verificar si el usuario está autenticado
    const verifyAuth = async () => {
        try {
            // Solo ejecutar en el cliente
            if (!isClient || typeof window === 'undefined') {
                return;
            }

            // Obtener token y rol desde localStorage
            const storedToken = getTokenFromStorage();
            const storedRol = getRolFromStorage();
            const currentPath = window.location.pathname;

            console.log('Ruta actual:', currentPath);

            if (!storedToken && currentPath === '/') {
                dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
                return;
            }

            // Si no hay token almacenado, marcar como no autenticado
            if (!storedToken) {
                dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
                return;
            }

            // Verificar el token con tu API
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                
                // Si el token es válido y no está en el estado, actualizarlo
                if (!state.token) {
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: { 
                            token: storedToken, 
                            rol: data.rol || storedRol || '' 
                        }
                    });
                } else {
                    dispatch({ 
                        type: 'VERIFY_TOKEN_SUCCESS',
                        payload: { rol: data.rol || storedRol }
                    });
                }
            } else {
                dispatch({ type: 'VERIFY_TOKEN_FAILURE' });

                // Navegar al inicio si el token no es válido y estamos en ruta protegida
                if (currentPath !== '/' && currentPath !== '/login') {
                    window.location.href = '/';
                }
            }
        } catch (error) {
            console.error('Error verificando token:', error);
            dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
            
            // Navegar al inicio en caso de error y si estamos en ruta protegida
            if (isClient && typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                if (currentPath !== '/' && currentPath !== '/login') {
                    window.location.href = '/';
                }
            }
        }
    };

    // Inicializar estado desde localStorage cuando el componente se monta en el cliente
    useEffect(() => {
        if (isClient) {
            const storedToken = getTokenFromStorage();
            const storedRol = getRolFromStorage();
            if (storedToken) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { token: storedToken, rol: storedRol }
                });
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
    }, [isClient]);

    // Verificar autenticación cuando el cliente esté listo
    useEffect(() => {
        if (isClient) {
            verifyAuth();
        }
    }, [isClient]);

    const value: AuthContextType = {
        state,
        login,
        logout,
        verifyAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;