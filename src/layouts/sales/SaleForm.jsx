import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSalesContext } from "../../context/SalesContext";
import { useUserContext } from "../../context/UserContext";
import { useProductContext } from "../../context/ProductContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Button } from "primereact/button";
import { AuthContext } from "../../context/AuthContext";

const validationSchema = Yup.object({
  usuarioId: Yup.number()
    .required("Debe seleccionar un usuario")
    .positive("Debe ser un ID válido"),

  productoId: Yup.number()
    .required("Debe seleccionar un producto")
    .positive("Debe ser un ID válido"),

  cantidad: Yup.number()
    .typeError("La cantidad debe ser un número")
    .positive("La cantidad debe ser mayor que 0")
    .integer("La cantidad debe ser un número entero")
    .required("La cantidad es requerida"),

  total: Yup.number()
    .typeError("El total debe ser un número")
    .positive("El total debe ser mayor que 0")
    .required("El total es requerido"),

  fecha: Yup.date()
    .required("La fecha es requerida")
});

export default function SaleForm() {
  const { sales, addSale, editSale } = useSalesContext();
  const { users } = useUserContext();
  const { products } = useProductContext();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [initialValues, setInitialValues] = useState({
    usuarioId: "",
    productoId: "",
    cantidad: 1,
    total: 0,
    fecha: new Date().toISOString().split('T')[0]
  });

  const isEdit = Boolean(id);
  const isAdmin = user?.rol === 'admin';

  // Verificar si el usuario actual es admin
  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>❌ Acceso Denegado</h2>
        <p>Solo los administradores pueden crear o editar ventas.</p>
        <p>Tu rol actual: <strong>{user?.rol}</strong></p>
        <Button
          label="Volver a Ventas"
          className="p-button-secondary p-button-rounded"
          onClick={() => navigate("/ventas")}
        />
      </div>
    );
  }

  useEffect(() => {
    if (isEdit) {
      const sale = sales.find((s) => s.id === Number(id));
      if (sale) {
        setInitialValues({
          usuarioId: sale.usuarioId || "",
          productoId: sale.productoId || "",
          cantidad: sale.cantidad || 1,
          total: sale.total || 0,
          fecha: sale.fecha ? new Date(sale.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
      }
    }
  }, [id, sales]);

  const handleSubmit = async (values) => {
    const saleData = {
      ...values,
      usuarioId: Number(values.usuarioId),
      productoId: Number(values.productoId),
      cantidad: Number(values.cantidad),
      total: Number(values.total),
      fecha: new Date(values.fecha).toISOString()
    };

    try {
      if (isEdit) {
        await editSale(Number(id), saleData);
        alert("Venta actualizada exitosamente");
      } else {
        await addSale(saleData);
        alert("Venta creada exitosamente");
      }
      navigate("/ventas");
    } catch (error) {
      alert("Error al " + (isEdit ? "actualizar" : "crear") + " la venta");
    }
  };

  const calculateTotal = (values, setFieldValue) => {
    const selectedProduct = products.find(p => p.id === Number(values.productoId));
    if (selectedProduct && values.cantidad) {
      const total = selectedProduct.precio * Number(values.cantidad);
      setFieldValue('total', total);
    }
  };

  return (
    <div className="p-d-flex p-flex-column p-align-center p-mt-3">
      <h2>{isEdit ? "Editar" : "Crear"} Venta</h2>
      
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        border: '1px solid #bee5eb', 
        padding: '1rem', 
        borderRadius: '0.25rem', 
        marginBottom: '1rem',
        maxWidth: '400px'
      }}>
        <p><strong>Información:</strong> Solo los administradores pueden crear y editar ventas.</p>
        <p>Rol actual: <strong>{user?.rol}</strong></p>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form
            className="p-d-flex p-flex-column p-gap-3"
            style={{ width: "100%", maxWidth: "400px" }}
          >
            <div>
              <label>Usuario:</label>
              <Field
                as="select"
                name="usuarioId"
                className="p-inputtext p-component p-mb-3"
                style={{ width: "100%", padding: "0.5rem" }}
              >
                <option value="">Seleccionar usuario</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.nombre} - {user.email}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="usuarioId"
                component="div"
                className="p-text-danger"
              />
            </div>

            <div>
              <label>Producto:</label>
              <Field
                as="select"
                name="productoId"
                className="p-inputtext p-component p-mb-3"
                style={{ width: "100%", padding: "0.5rem" }}
                onChange={(e) => {
                  setFieldValue('productoId', e.target.value);
                  calculateTotal({ ...values, productoId: e.target.value }, setFieldValue);
                }}
              >
                <option value="">Seleccionar producto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.nombre} - ${product.precio}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="productoId"
                component="div"
                className="p-text-danger"
              />
            </div>

            <div>
              <label>Cantidad:</label>
              <Field
                name="cantidad"
                type="number"
                min="1"
                className="p-inputtext p-component p-mb-3"
                placeholder="Cantidad"
                onChange={(e) => {
                  setFieldValue('cantidad', e.target.value);
                  calculateTotal({ ...values, cantidad: e.target.value }, setFieldValue);
                }}
              />
              <ErrorMessage
                name="cantidad"
                component="div"
                className="p-text-danger"
              />
            </div>

            <div>
              <label>Total:</label>
              <Field
                name="total"
                type="number"
                step="0.01"
                className="p-inputtext p-component p-mb-3"
                placeholder="Total"
              />
              <ErrorMessage
                name="total"
                component="div"
                className="p-text-danger"
              />
            </div>

            <div>
              <label>Fecha:</label>
              <Field
                name="fecha"
                type="date"
                className="p-inputtext p-component p-mb-3"
              />
              <ErrorMessage
                name="fecha"
                component="div"
                className="p-text-danger"
              />
            </div>

            <div className="p-d-flex p-gap-3">
              <Button
                type="submit"
                label={isEdit ? "Actualizar" : "Crear"}
                className="p-button-success p-button-rounded"
              />
              <Button
                label="Volver"
                className="p-button-secondary p-button-rounded"
                onClick={() => navigate("/ventas")}
                type="button"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}