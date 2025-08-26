import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

export default function Home() {
  const { user } = useContext(AuthContext);

  const getRoleColor = (rol) => {
    const colors = {
      admin: '#e74c3c',
      moderador: '#f39c12',
      cliente: '#27ae60'
    };
    return colors[rol] || '#6c757d';
  };

  const getRoleIcon = (rol) => {
    const icons = {
      admin: 'pi-shield',
      moderador: 'pi-star',
      cliente: 'pi-user'
    };
    return icons[rol] || 'pi-user';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          color: '#2c3e50',
          marginBottom: '1rem',
          fontSize: '2.5rem'
        }}>
          🏪 Sistema de Gestión
        </h1>
        <p style={{ 
          color: '#7f8c8d',
          fontSize: '1.2rem'
        }}>
          Plataforma integral para administrar productos, usuarios y ventas
        </p>
      </div>

      {!user ? (
        <div style={{ display: 'grid', gap: '2rem' }}>
          <Card 
            title="¡Bienvenido!" 
            style={{ textAlign: 'center' }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Para acceder al sistema, necesitas iniciar sesión o crear una cuenta.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  label="Iniciar Sesión" 
                  icon="pi pi-sign-in"
                  className="p-button-primary p-button-raised"
                  onClick={() => window.location.href = '/inicio-sesion'}
                />
                <Button 
                  label="Registrarse" 
                  icon="pi pi-user-plus"
                  className="p-button-success p-button-raised"
                  onClick={() => window.location.href = '/registro'}
                />
              </div>
            </div>
          </Card>

          <Card title="Características del Sistema">
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <i className="pi pi-box" style={{ fontSize: '1.5rem', color: '#3498db' }}></i>
                <div>
                  <strong>Gestión de Productos</strong>
                  <p>Administra el inventario y precios de productos</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <i className="pi pi-users" style={{ fontSize: '1.5rem', color: '#9b59b6' }}></i>
                <div>
                  <strong>Administración de Usuarios</strong>
                  <p>Control de acceso y roles del sistema</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <i className="pi pi-chart-line" style={{ fontSize: '1.5rem', color: '#e74c3c' }}></i>
                <div>
                  <strong>Control de Ventas</strong>
                  <p>Registro y seguimiento de transacciones</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '2rem' }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '1rem', 
                marginBottom: '1rem' 
              }}>
                <i 
                  className={`pi ${getRoleIcon(user.rol)}`} 
                  style={{ 
                    fontSize: '2rem', 
                    color: getRoleColor(user.rol) 
                  }}
                ></i>
                <div>
                  <h2 style={{ margin: 0, color: '#2c3e50' }}>
                    ¡Bienvenido, {user.nombre}!
                  </h2>
                  <span 
                    style={{
                      backgroundColor: getRoleColor(user.rol),
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '1rem',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {user.rol.toUpperCase()}
                  </span>
                </div>
              </div>
              <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
                {user.rol === 'admin' 
                  ? 'Tienes acceso completo al sistema como administrador'
                  : user.rol === 'moderador'
                  ? 'Tienes permisos de moderador en el sistema'
                  : 'Bienvenido al sistema como cliente'
                }
              </p>
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <Card 
              title="Productos" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => window.location.href = '/productos'}
            >
              <div style={{ textAlign: 'center' }}>
                <i className="pi pi-box" style={{ fontSize: '3rem', color: '#3498db', marginBottom: '1rem' }}></i>
                <p>Ver y gestionar productos</p>
                {user.rol === 'admin' && (
                  <small style={{ color: '#27ae60' }}>✓ Crear, editar, eliminar</small>
                )}
              </div>
            </Card>

            <Card 
              title="Usuarios" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => window.location.href = '/usuarios'}
            >
              <div style={{ textAlign: 'center' }}>
                <i className="pi pi-users" style={{ fontSize: '3rem', color: '#9b59b6', marginBottom: '1rem' }}></i>
                <p>Ver lista de usuarios</p>
                {user.rol === 'admin' && (
                  <small style={{ color: '#27ae60' }}>✓ Editar roles y eliminar</small>
                )}
              </div>
            </Card>
            <Card 
              title="Ventas" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => window.location.href = '/ventas'}
            >
              <div style={{ textAlign: 'center' }}>
                <i className="pi pi-chart-line" style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}></i>
                <p>Ver registro de ventas</p>
                {user.rol === 'admin' && (
                  <small style={{ color: '#27ae60' }}>✓ Crear, editar, eliminar</small>
                )}
              </div>
            </Card>
          </div>

          {user.rol === 'admin' && (
            <>
              <Divider />
              <Card title="Panel de Administrador" className="p-shadow-3">
                <div style={{ 
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                  color: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <i className="pi pi-shield" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                  <h3 style={{ margin: '0 0 1rem 0' }}>Acceso Total al Sistema</h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>
                    Como administrador puedes crear, editar y eliminar productos, usuarios y ventas.
                    También puedes cambiar los roles de otros usuarios.
                  </p>
                </div>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}