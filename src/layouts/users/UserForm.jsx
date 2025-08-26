import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUserContext } from "../../context/UserContext"; 
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Button } from "primereact/button";
import { AuthContext } from "../../context/AuthContext";
import { Toast } from 'primereact/toast';
import { useRef } from "react";

const validationSchema = Yup.object({
  nombre: Yup.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es requerido"),

  email: Yup.string()
    .email("Email inválido")
    .required("El email es requerido"),

  edad: Yup.number()
    .typeError("La edad debe ser un número")
    .min(1, "La edad debe ser mayor que 0")
    .max(120, "La edad debe ser menor que 120")
    .required("La edad es requerida"),

  rol: Yup.string()
    .oneOf(['admin', 'moderador', 'cliente'], 'Rol inválido')
    .required("El rol es requerido"),
});

export default function UserForm() {
  const { users, editUser, error, clearError } = useUserContext();
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);
  const [initialValues, setInitialValues] = useState({
    nombre: "",
    email: "",
    edad: 0,
    rol: "cliente"
  });

  const isAdmin = user?.rol === 'admin';

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>⛔ Acceso Denegado</h2>
        <p>Solo los administradores pueden editar usuarios.</p>
        <p>Tu rol actual: <strong>{user?.rol}</strong></p>
        <Button
          label="Volver a Usuarios"
          className="p-button-secondary p-button-rounded"
          onClick={() => navigate("/usuarios")}
        />
      </div>
    );
  }

  if (!id) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>ℹ️ Información</h2>
        <p>Los usuarios se registran por sí mismos en la página de registro.</p>
        <p>Como administrador, solo puedes editar usuarios existentes.</p>
        <Button
          label="Volver a Usuarios"
          className="p-button-secondary p-button-rounded"
          onClick={() => navigate("/usuarios")}
        />
      </div>
    );
  }

  useEffect(() => {
    if (id) {
      const userToEdit = users.find((u) => u.id === Number(id));
      if (userToEdit) {
        setInitialValues({
          nombre: userToEdit.nombre || "",
          email: userToEdit.email || "",
          edad: userToEdit.edad || 0,
          rol: userToEdit.rol || "cliente"
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario no encontrado',
          life: 3000
        });
        navigate("/usuarios");
      }
    }
  }, [id, users, navigate]);

  useEffect(() => {
    if (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error,
        life: 5000
      });
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await editUser(Number(id), values);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado exitosamente',
        life: 3000
      });

      setTimeout(() => {
        navigate("/usuarios");
      }, 1500);

    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar el usuario',
        life: 5000
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleInfo = (rol) => {
    const roleInfo = {
      admin: {
        color: '#e74c3c',
        icon: 'pi-shield',
        description: 'Acceso completo al sistema'
      },
      moderador: {
        color: '#f39c12',
        icon: 'pi-star',
        description: 'Permisos de moderación'
      },
      cliente: {
        color: '#27ae60',
        icon: 'pi-user',
        description: 'Acceso básico de cliente'
      }
    };
    return roleInfo[rol] || roleInfo.cliente;
  };

  return (
    <div className="p-d-flex p-flex-column p-align-center p-mt-3">
      <Toast ref={toast} />
      
      <h2>Editar Usuario</h2>
      
      <div style={{ 
        backgroundColor: '#d1ecf1', 
        border: '1px solid #bee5eb', 
        padding: '1rem', 
        borderRadius: '0.25rem', 
        marginBottom: '1rem',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <p><strong>🛡️ Panel de Administrador</strong></p>
        <p>Puedes editar todos los datos del usuario, incluyendo su rol.</p>
        <p><strong>⚠️ Importante:</strong> Cambiar el rol afectará los permisos del usuario.</p>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form
            className="p-d-flex p-flex-column p-gap-3"
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <div>
              <label>Nombre:</label>
              <Field
                name="nombre"
                className="p-inputtext p-component p-mb-3"
                placeholder="Nombre completo"
                style={{ width: "100%" }}
              />
              <ErrorMessage
                name="nombre"
                component="div"
                className="p-text-danger"
              />
            </div>

            <div>
              <label>Email:</label>
              <Field
                name="email"
                type="email"
                className="p-inputtext p-component p-mb-3"
                placeholder="correo@ejemplo.com"
                style={{ width: "100%" }}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="p-text-danger"
              />
            </div>

            <div>
              <label>Edad:</label>
              <Field
                name="edad"
                type="number"
                min="1"
                max="170"
                className="p-inputtext p-component p-mb-3"
                placeholder="Edad"
                style={{ width: "100%" }}
              />
              <ErrorMessage
                name="edad"
                component="div"
                className="p-text-danger"
              />
            </div>

            <div>
              <label>Rol del Usuario:</label>
              <Field
                as="select"
                name="rol"
                className="p-inputtext p-component p-mb-3"
                style={{ width: "100%", padding: "0.5rem" }}
              >
                <option value="cliente">Cliente</option>
                <option value="moderador">Moderador</option>
                <option value="admin">Administrador</option>
              </Field>
              <ErrorMessage
                name="rol"
                component="div"
                className="p-text-danger"
              />
              
              {values.rol && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: getRoleInfo(values.rol).color + '20',
                  border: `1px solid ${getRoleInfo(values.rol).color}`,
                  borderRadius: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i 
                    className={`pi ${getRoleInfo(values.rol).icon}`}
                    style={{ color: getRoleInfo(values.rol).color }}
                  ></i>
                  <div>
                    <strong style={{ color: getRoleInfo(values.rol).color }}>
                      {values.rol.toUpperCase()}
                    </strong>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                      {getRoleInfo(values.rol).description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {initialValues.rol === 'admin' && values.rol !== 'admin' && (
              <div style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                padding: '1rem',
                borderRadius: '0.25rem',
                marginBottom: '1rem'
              }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#856404' }}>
                  ⚠️ Advertencia: Estás quitando privilegios de administrador
                </p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#856404' }}>
                  Este usuario perderá acceso completo al sistema.
                </p>
              </div>
            )}

            <div className="p-d-flex p-gap-3">
              <Button
                type="submit"
                label={isSubmitting ? "Actualizando..." : "Actualizar Usuario"}
                className="p-button-success p-button-rounded"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
              <Button
                label="Volver"
                className="p-button-secondary p-button-rounded"
                onClick={() => navigate("/usuarios")}
                type="button"
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}