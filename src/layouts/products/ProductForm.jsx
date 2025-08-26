import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useProductContext } from "../../context/ProductContext"; 
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Button } from "primereact/button";
import { AuthContext } from "../../context/AuthContext";

const validationSchema = Yup.object({
  nombre: Yup.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es requerido"),

  precio: Yup.number()
    .typeError("El precio debe ser un número")
    .positive("El precio debe ser mayor que 0")
    .required("El precio es requerido"),
});

export default function ProductForm() {
  const { products, addProduct, editProduct } = useProductContext();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    nombre: "",
    precio: 0,
  });

  const isEdit = Boolean(id);
  const isAdmin = user?.rol === 'admin';

  // Verificar si el usuario actual es admin
  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>❌ Acceso Denegado</h2>
        <p>Solo los administradores pueden crear o editar productos.</p>
        <p>Tu rol actual: <strong>{user?.rol}</strong></p>
        <Button
          label="Volver a Productos"
          className="p-button-secondary p-button-rounded"
          onClick={() => navigate("/productos")}
        />
      </div>
    );
  }

  useEffect(() => {
    if (isEdit) {
      const product = products.find((p) => p.id === Number(id));
      if (product) {
        setInitialValues({
          nombre: product.nombre || "",
          precio: product.precio || 0,
        });
      }
    }
  }, [id, products]);

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await editProduct(Number(id), values);
        alert("Producto actualizado exitosamente");
      } else {
        await addProduct(values);
        alert("Producto creado exitosamente");
      }
      navigate("/productos");
    } catch (error) {
      alert("Error al " + (isEdit ? "actualizar" : "crear") + " el producto");
    }
  };

  return (
    <div className="p-d-flex p-flex-column p-align-center p-mt-3">
      <h2>{isEdit ? "Editar" : "Crear"} Producto</h2>
      
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        border: '1px solid #bee5eb', 
        padding: '1rem', 
        borderRadius: '0.25rem', 
        marginBottom: '1rem',
        maxWidth: '400px'
      }}>
        <p><strong>Información:</strong> Solo los administradores pueden crear y editar productos.</p>
        <p>Rol actual: <strong>{user?.rol}</strong></p>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form
          className="p-d-flex p-flex-column p-gap-3"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <div>
            <label>Nombre:</label>
            <Field
              name="nombre"
              className="p-inputtext p-component p-mb-3"
              placeholder="Nombre del producto"
              style={{ width: "100%" }}
            />
            <ErrorMessage
              name="nombre"
              component="div"
              className="p-text-danger"
            />
          </div>

          <div>
            <label>Precio:</label>
            <Field
              name="precio"
              type="number"
              step="0.01"
              min="0"
              className="p-inputtext p-component p-mb-3"
              placeholder="Precio en ARS"
              style={{ width: "100%" }}
            />
            <ErrorMessage
              name="precio"
              component="div"
              className="p-text-danger"
            />
            <small style={{ color: '#6c757d' }}>
              Ingrese el precio en pesos argentinos
            </small>
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
              onClick={() => navigate("/productos")}
              type="button"
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
}