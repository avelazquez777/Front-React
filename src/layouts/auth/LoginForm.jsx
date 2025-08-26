import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { InputText } from "primereact/inputtext"
import { Password } from 'primereact/password';
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Link } from "react-router-dom"
        
const LoginForm = () => {

    const { login } = useContext(AuthContext)

    const initialValuesUser = {
        email: '',
        password: ''
    }

    const validationSchemaUser = Yup.object({
        email: Yup.string().email('Email invalido').required('Campo requerido'),
        password: Yup.string().required('Campo requerido')
    }) 

    const onSubmitLogin = async (values) => {
        await login(values)
    }

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            padding: '2rem' 
        }}>
            <Card 
                title='Iniciar sesión'
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <Formik 
                    initialValues={initialValuesUser} 
                    validationSchema={validationSchemaUser} 
                    onSubmit={onSubmitLogin}
                >
                    {({ handleChange, values }) => (
                        <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label>Email</label>
                                <InputText 
                                    name='email' 
                                    value={values.email} 
                                    onChange={handleChange}
                                    style={{ width: '100%' }}
                                />
                                <span className="text-danger">
                                    <ErrorMessage name='email' />
                                </span>
                            </div>
                            
                            <div>
                                <label>Contraseña</label> 
                                <Password 
                                    name='password' 
                                    value={values.password} 
                                    onChange={handleChange}
                                    style={{ width: '100%' }}
                                    feedback={false}
                                />
                                <span className="text-danger">
                                    <ErrorMessage name='password' />
                                </span>
                            </div>
                            
                            <Button 
                                label='Iniciar sesión' 
                                type='submit'
                                className="p-button-primary p-button-rounded"
                            />
                        </Form>
                    )}
                </Formik>

                {/* Sección para registro */}
                <div style={{ 
                    marginTop: '2rem', 
                    textAlign: 'center',
                    borderTop: '1px solid #e0e0e0',
                    paddingTop: '1rem'
                }}>
                    <p style={{ marginBottom: '1rem' }}>¿No tienes cuenta?</p>
                    <Link to="/registro">
                        <Button 
                            label="Registrarse" 
                            className="p-button-secondary p-button-rounded p-button-outlined"
                            style={{ width: '100%' }}
                        />
                    </Link>
                </div>
            </Card>
        </div>
    )
}

export default LoginForm