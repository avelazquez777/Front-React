import { useUserContext } from '../../context/UserContext';
import { exportToPDF } from '../../utils/ExportToPdf';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function UsersView() {
  const { users, deleteUser, loading, error } = useUserContext();
  const { user } = useContext(AuthContext);
  
  const isAdmin = user?.rol === 'admin';

  const handleExport = () => {
    exportToPDF(users, 'Usuarios', ['nombre', 'email', 'edad', 'rol']);
  };

  const getRoleBadge = (rol) => {
    const colors = {
      admin: '#e74c3c',
      moderador: '#f39c12',
      cliente: '#27ae60'
    };
    
    return (
      <span 
        style={{
          backgroundColor: colors[rol] || '#6c757d',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}
      >
        {rol?.toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <h2>👥 Lista de Usuarios 👥</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/">
          <Button 
            label="Volver al inicio" 
            icon="pi pi-home" 
            className="p-button-rounded p-button-secondary mr-2" 
          />
        </Link>
        <Button 
          label="Exportar PDF" 
          icon="pi pi-file-pdf" 
          className="p-button-rounded p-button-warning" 
          onClick={handleExport} 
        />
      </div>

      {isAdmin ? (
        <div style={{ 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb', 
          padding: '1rem', 
          borderRadius: '0.25rem', 
          marginBottom: '1rem' 
        }}>
          <p><strong>✅ Administrador:</strong> Puedes editar y eliminar usuarios.</p>
          <p><strong>ℹ️ Nota:</strong> Los nuevos usuarios se registran por sí mismos en la página de registro.</p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          padding: '1rem', 
          borderRadius: '0.25rem', 
          marginBottom: '1rem' 
        }}>
          <p><strong>Información:</strong> Solo los administradores pueden editar y eliminar usuarios.</p>
          <p>Tu rol actual: <strong>{user?.rol}</strong></p>
        </div>
      )}

      {loading && <p>Cargando usuarios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <DataTable 
        value={Array.isArray(users) ? users : []} 
        paginator={true} 
        rows={10}
        className="p-datatable-sm p-shadow-2 mt-4"
      >
        <Column field="nombre" header="Nombre" />
        <Column field="email" header="Email" />
        <Column field="edad" header="Edad" />
        <Column 
          field="rol" 
          header="Rol"
          body={(rowData) => getRoleBadge(rowData.rol)}
        />

        {isAdmin && (
          <Column 
            header="Acciones" 
            body={(rowData) => (
              <>
                <Link to={`/usuarios/editar/${rowData.id}`}>
                  <Button 
                    label="Editar" 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-info mr-2" 
                  />
                </Link>
                <Button 
                  label="Eliminar" 
                  icon="pi pi-trash" 
                  className="p-button-rounded p-button-danger" 
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
                      deleteUser(rowData.id);
                    }
                  }}
                />
              </>
            )}
          />
        )}
      </DataTable>
    </div>
  );
}