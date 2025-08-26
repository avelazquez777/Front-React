import { useProductContext } from '../../context/ProductContext';
import { exportToPDF } from '../../utils/ExportToPdf';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';  
import { Column } from 'primereact/column';        
import { Button } from 'primereact/button';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function ProductsView() {
  const { products, deleteProduct, loading, error } = useProductContext();
  const { user } = useContext(AuthContext);
  
  const isAdmin = user?.rol === 'admin';

  const handleExport = () => {
    exportToPDF(products, 'Productos', ['nombre', 'precio']);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  };

  return (
    <div>
      <h2>📦 Lista de Productos 📦</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        {isAdmin && (
          <Link to="/productos/crear">
            <Button 
              label="Crear nuevo producto" 
              icon="pi pi-plus" 
              className="p-button-rounded p-button-success mr-2" 
            />
          </Link>
        )}
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

      {!isAdmin && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          padding: '1rem', 
          borderRadius: '0.25rem', 
          marginBottom: '1rem' 
        }}>
          <p><strong>Información:</strong> Solo los administradores pueden crear, editar y eliminar productos.</p>
        </div>
      )}

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <DataTable 
        value={Array.isArray(products) ? products : []} 
        paginator={true} 
        rows={10}
        className="p-datatable-sm p-shadow-2 mt-4"
      >
        <Column field="nombre" header="Nombre" />
        <Column 
          field="precio" 
          header="Precio" 
          body={(rowData) => formatCurrency(rowData.precio)}
        />

        {isAdmin && (
          <Column 
            header="Acciones" 
            body={(rowData) => (
              <>
                <Link to={`/productos/editar/${rowData.id}`}>
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
                    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
                      deleteProduct(rowData.id);
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