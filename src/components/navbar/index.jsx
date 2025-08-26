import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = (rol) => {
    const colors = {
      admin: 'danger',
      moderador: 'warning', 
      cliente: 'success'
    };
    return colors[rol] || 'info';
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <Link 
            to="/" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="pi pi-home"></i>
            Sistema de Gestión
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {!user ? (
            <>
              <Link to="/">
                <Button 
                  label="Inicio" 
                  className="p-button-text p-button-plain"
                  style={{ color: 'white' }}
                />
              </Link>
              <Link to="/inicio-sesion">
                <Button 
                  label="Iniciar Sesión" 
                  icon="pi pi-sign-in"
                  className="p-button-outlined p-button-secondary"
                  style={{ borderColor: 'white', color: 'white' }}
                />
              </Link>
              <Link to="/registro">
                <Button 
                  label="Registrarse" 
                  icon="pi pi-user-plus"
                  className="p-button-success"
                />
              </Link>
            </>
          ) : (
            <>
              <Link to="/">
                <Button 
                  label="Inicio" 
                  className="p-button-text p-button-plain"
                  style={{ color: 'white' }}
                />
              </Link>
              <Link to="/productos">
                <Button 
                  label="Productos" 
                  icon="pi pi-box"
                  className="p-button-text p-button-plain"
                  style={{ color: 'white' }}
                />
              </Link>
              <Link to="/usuarios">
                <Button 
                  label="Usuarios" 
                  icon="pi pi-users"
                  className="p-button-text p-button-plain"
                  style={{ color: 'white' }}
                />
              </Link>
              <Link to="/ventas">
                <Button 
                  label="Ventas" 
                  icon="pi pi-chart-line"
                  className="p-button-text p-button-plain"
                  style={{ color: 'white' }}
                />
              </Link>

              {user.rol === 'admin' && (
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>
                  <span style={{ 
                    color: 'white', 
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    <i className="pi pi-shield" style={{ marginRight: '0.3rem' }}></i>
                    Panel Admin
                  </span>
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <i className="pi pi-user" style={{ color: 'white' }}></i>
                <span style={{ color: 'white', fontSize: '0.9rem' }}>
                  {user.nombre}
                </span>
                <Badge 
                  value={user.rol.toUpperCase()} 
                  severity={getRoleBadge(user.rol)}
                  style={{ fontSize: '0.7rem' }}
                />
              </div>

              <Button 
                label="Cerrar Sesión" 
                icon="pi pi-sign-out"
                className="p-button-danger p-button-outlined"
                onClick={handleLogout}
                style={{ borderColor: 'white', color: 'white' }}
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}