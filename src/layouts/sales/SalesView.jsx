import { useSalesContext } from '../../context/SalesContext';
import { exportToPDF } from '../../utils/ExportToPdf';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';  
import { Column } from 'primereact/column';        
import { Button } from 'primereact/button';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function SalesView() {
  const { sales, deleteSale, loading, error } = useSalesContext();
  const { user } = useContext(AuthContext);
  
  const isAdmin = user?.rol === 'admin';

  const handleExport = () => {
    const salesForExport = sales.map(sale => ({
      usuario: sale.Usuario?.nombre || 'N/A',
      producto: sale.Producto?.nombre || 'N/A',
      cantidad: sale.cantidad,
      total: sale.total,
      fecha: new Date(sale.fecha).toLocaleDateString()
    }));
    exportToPDF(salesForExport, 'Ventas', ['usuario', 'producto', 'cantidad', 'total', 'fecha']);
  };

  const formatDate = (rowData) => {
    return new Date(rowData.fecha).toLocaleDateString();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  };

  return (
    <div>
      <h2>💰 Lista de Ventas 💰</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        {isAdmin && (
          <Link to="/ventas/crear">
            <Button 
              label="Crear nueva venta" 
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

      {loading && <p>Cargando ventas...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <DataTable 
        value={Array.isArray(sales) ? sales : []} 
        paginator={true} 
        rows={10}
        className="p-datatable-sm p-shadow-2 mt-4"
      >
        <Column 
          field="Usuario.nombre" 
          header="Usuario"
          body={(rowData) => rowData.Usuario?.nombre || 'N/A'}
        />
        <Column 
          field="Producto.nombre" 
          header="Producto"
          body={(rowData) => rowData.Producto?.nombre || 'N/A'}
        />
        <Column field="cantidad" header="Cantidad" />
        <Column 
          field="total" 
          header="Total"
          body={(rowData) => formatCurrency(rowData.total)}
        />
        <Column 
          field="fecha" 
          header="Fecha"
          body={formatDate}
        />

        {isAdmin && (
          <Column 
            header="Acciones" 
            body={(rowData) => (
              <>
                <Link to={`/ventas/editar/${rowData.id}`}>
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
                    if (window.confirm('¿Estás seguro de eliminar esta venta?')) {
                      deleteSale(rowData.id);
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