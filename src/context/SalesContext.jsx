import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';

export const SalesContext = createContext();

const BASE_URL = 'http://localhost:3000/ventas';

export const SalesProvider = ({ children }) => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getSales = async () => {
        setLoading(true);
        try {
            const { data: responseData } = await axios.get(BASE_URL);
            console.log("Respuesta ventas:", responseData);
            setSales(Array.isArray(responseData.data) ? responseData.data : []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const addSale = async (newSale) => {
        setLoading(true);
        try {
            const { data: responseData } = await axios.post(BASE_URL, newSale);
            const created = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data || responseData;
            setSales(prev => Array.isArray(prev) ? [...prev, created] : [created]);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const editSale = async (id, updated) => {
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/${id}`, updated);
            setSales(prev =>
                prev.map(s => (s.id === id ? { ...updated, id: id } : s)));
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteSale = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            setSales(prev => prev.filter(s => s.id !== id));
        } catch (e) {
            setError(e.message);
        }
    };

    useEffect(() => {
        getSales();
    }, []);

    return (
        <SalesContext.Provider
            value={{
                sales,
                loading,
                error,
                getSales,
                addSale,
                editSale,
                deleteSale
            }}
        >
            {children}
        </SalesContext.Provider>
    );
};

export const useSalesContext = () => {
    return useContext(SalesContext);
};