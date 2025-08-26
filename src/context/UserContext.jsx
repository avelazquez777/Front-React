import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';

export const UserContext = createContext();

const BASE_URL = 'http://localhost:3000/usuarios'

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAuthError = (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common["Authorization"];
            window.location.href = '/inicio-sesion';
            return;
        }
        throw error; 
    };

    const getUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: responseData } = await axios.get(BASE_URL);
            console.log("Respuesta usuarios:", responseData);
            setUsers(Array.isArray(responseData.data) ? responseData.data : []);
        } catch (e) {
            try {
                handleAuthError(e);
            } catch (handledError) {
                setError(handledError.response?.data?.message || handledError.message || 'Error al obtener usuarios');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const addUser = async (newUser) => {
        setLoading(true);
        setError(null);
        try {
            const { data: responseData } = await axios.post(BASE_URL, newUser);
            const created = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data || responseData;
            setUsers(prev => Array.isArray(prev) ? [...prev, created] : [created]);
            return created;
        } catch (e) {
            try {
                handleAuthError(e);
            } catch (handledError) {
                const errorMessage = handledError.response?.data?.message || handledError.message || 'Error al crear usuario';
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const editUser = async (id, updated) => {
        setLoading(true);
        setError(null);
        try {
            const { data: responseData } = await axios.put(`${BASE_URL}/${id}`, updated);
            const updatedUser = responseData.data || { ...updated, id };
            
            setUsers(prev =>
                prev.map(u => (u.id === id ? updatedUser : u))
            );
            return updatedUser;
        } catch (e) {
            try {
                handleAuthError(e);
            } catch (handledError) {
                const errorMessage = handledError.response?.data?.message || handledError.message || 'Error al editar usuario';
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const deleteUser = async (id) => {
        setError(null);
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (e) {
            try {
                handleAuthError(e);
            } catch (handledError) {
                const errorMessage = handledError.response?.data?.message || handledError.message || 'Error al eliminar usuario';
                setError(errorMessage);
                alert(errorMessage);
            }
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <UserContext.Provider
            value={{
                users,
                loading,
                error,
                getUsers,
                addUser,
                editUser,
                deleteUser,
                clearError: () => setError(null)
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};