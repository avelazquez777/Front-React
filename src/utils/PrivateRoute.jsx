import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext)
    
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh',
                fontSize: '1.1rem' 
            }}>
                Verificando autenticación...
            </div>
        )
    }
    
    return user ? children : <Navigate to='/inicio-sesion'/>
}

export default PrivateRoute