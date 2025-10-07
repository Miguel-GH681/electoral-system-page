import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';



const LoginPage = () => {
    const [membershipNumber, setMembershipNumber] = useState('');
    const [dpi, setDpi] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault(); // investigar
        setError(null);
        setLoading(true);
        try {
            const resp = await login(membershipNumber, dpi, birthdate, password);
            if (resp.ok) {
                navigate('/campaigns');
            } else {
                setError(resp.message || 'Credenciales inválidas');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Error en el servidor');
        } finally{
            setLoading(false);
        }
    };


    return (
        <Container className="mt-5 p-4">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Container className='d-flex justify-content-center mb-5'><h2>Iniciar sesión</h2></Container>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formMembershipNumber">
                            <Form.Label>NÚMERO DE COLEGIADO</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="123456" 
                                value={ membershipNumber } 
                                onChange={ (e) => setMembershipNumber(e.target.value) 
                            }/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDPI">
                            <Form.Label>DPI</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="1234567890101"
                                value={ dpi }
                                onChange={ (e) => setDpi(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBirdthdate">
                            <Form.Label>FECHA DE NACIMIENTO</Form.Label>
                            <Form.Control 
                                type='date'
                                value={ birthdate }
                                onChange={ (e) => setBirthdate(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="********"
                                value={ password }
                                onChange={ (e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="warning" type="submit" disabled={loading || (!membershipNumber || !dpi || !birthdate || !password)} className="w-100">
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};


export default LoginPage;