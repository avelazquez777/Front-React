import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';

export const ProductContext = createContext();

const BASE_URL = 'http://localhost:3000/productos'

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
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

    const getProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: responseData } = await axios.get(BASE_URL);
            setProducts(Array.isArray(responseData.data) ? responseData.data : []);
        } catch (e) {
            try {
                handleAuthError(e);
            } catch (handledError) {
                setError(handledError.response?.data?.message || handledError.message || 'Error al obtener productos');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const addProduct = async (newProduct) => {
        setLoading(true);
        setError(null);
        try {
            const { data: responseData } = await axios.post(BASE_URL, newProduct);
            const created = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data || responseData;
            setProducts(prev => Array.isArray(prev) ? [...prev, created] : [created]);
            return created;
        } catch (e) {
            try {
                handleAuthError(e);
            } catch (handledError) {
                const errorMessage = handledError.response?.data?.message || handledError.message || 'Error al crear producto';
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const editProduct = async (id, updated) => {
        setLoading(true);
        setError(null);
        try {
            const { data: responseData } = await axios.put(`${BASE_URL}/${id}`, updated);
            const updatedProduct = responseData.data || { ...updated, id };
            
            setProducts(prev =>
                prev.map(p => (p.id === id ? updatedProduct : p))
            );
            return updatedProduct;
        } catch (e) {
            try {
                handleAuthError(e);
            } catch (handledError) {
                const errorMessage = handledError.response?.data?.message || handledError.message || 'Error al editar producto';
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const deleteProduct = async (id) => {
        setError(null);
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            try {
                handleAuthError(e);
            } catch (handledError) {
                const errorMessage = handledError.response?.data?.message || handledError.message || 'Error al eliminar producto';
                setError(errorMessage);
                alert(errorMessage);
            }
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                error,
                getProducts,
                addProduct,
                editProduct,
                deleteProduct,
                clearError: () => setError(null)
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    return useContext(ProductContext);
};