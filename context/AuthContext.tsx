import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';

// Tipos para el estado de autenticación
interface AuthState {
    token: string;
    loading: boolean;
    isAuthenticated: boolean;
}

// Tipos para las acciones del reducer
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { token: string } }
    | { type: 'LOGIN_FAILURE' }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'VERIFY_TOKEN_SUCCESS' }
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

// Función para guardar token en localStorage
const saveTokenToStorage = (token: string): void => {
    if (isLocalStorageAvailable()) {
        localStorage.setItem('auth_token', token);
    }
};

// Función para eliminar token de localStorage
const removeTokenFromStorage = (): void => {
    if (isLocalStorageAvailable()) {
        localStorage.removeItem('auth_token');
    }
};

// Estado inicial - obtiene el token desde localStorage si está disponible
const initialState: AuthState = {
    token: getTokenFromStorage(),
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
            // Guardar token en localStorage
            saveTokenToStorage(action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                loading: false,
                isAuthenticated: true,
            };

        case 'LOGIN_FAILURE':
            // Eliminar token de localStorage en caso de fallo
            removeTokenFromStorage();
            return {
                ...state,
                token: '',
                loading: false,
                isAuthenticated: false,
            };

        case 'LOGOUT':
            // Eliminar token de localStorage al cerrar sesión
            removeTokenFromStorage();
            return {
                ...state,
                token: '',
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
                loading: false,
                isAuthenticated: true,
            };

        case 'VERIFY_TOKEN_FAILURE':
            // Eliminar token de localStorage si la verificación falla
            removeTokenFromStorage();
            return {
                ...state,
                token: '',
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
    login: (tokenData: { token: string }) => void;
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
    const router = useRouter();

    // Función para verificar si estamos en una ruta específica
    const isCurrentRoute = (path: string): boolean => {
        return router.pathname === path;
    };

    // Función para iniciar sesión
    const login = (tokenData: { token: string }) => {
        try {
            dispatch({ type: 'LOGIN_START' });

            // El token se guarda automáticamente en localStorage a través del reducer
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token: tokenData.token }
            });

            console.log('Login exitoso');

            // Navegar al dashboard después del login exitoso
            router.push('/dashboard');

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

        // Navegar al inicio después de cerrar sesión
        router.push('/');
    };

    // Función para verificar si el usuario está autenticado
    const verifyAuth = async () => {
        try {
            // Obtener token desde localStorage (puede ser diferente del estado si se recargó la página)
            const storedToken = getTokenFromStorage();

            console.log('Ruta actual:', router.pathname);

            if (!storedToken && isCurrentRoute('/')) {
                dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
                // Navegar al inicio si no hay token
                router.push('/');
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
                // Si el token es válido y no está en el estado, actualizarlo
                if (!state.token) {
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: { token: storedToken }
                    });
                } else {
                    dispatch({ type: 'VERIFY_TOKEN_SUCCESS' });
                }
            } else {
                dispatch({ type: 'VERIFY_TOKEN_FAILURE' });

                // Navegar al inicio si el token no es válido y estamos en ruta protegida
                if (!isCurrentRoute('/') && !isCurrentRoute('/login')) {
                    router.push('/');
                }
            }
        } catch (error) {
            console.error('Error verificando token:', error);
            dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
            
            // Navegar al inicio en caso de error y si estamos en ruta protegida
            if (!isCurrentRoute('/') && !isCurrentRoute('/login')) {
                router.push('/');
            }
        }
    };

    // Verificar autenticación al cargar el componente
    useEffect(() => {
        // Solo ejecutar verifyAuth si estamos en el cliente
        if (router.isReady) {
            verifyAuth();
        }
    }, [router.isReady]);

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