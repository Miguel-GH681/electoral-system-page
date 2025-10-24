import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import styles from "../styles/login.module.scss";


const LoginPage = () => {
    const [membershipNumber, setMembershipNumber] = useState('');
    const [dpi, setDpi] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();


    const sendLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            const resp = await login(membershipNumber, dpi, birthdate, password);
            if (resp.ok) {
                navigate('/campaigns');
            } else {
                setError(resp.msg || 'Credenciales inválidas');
            }
        } catch (err : any) {
            console.error(err);
            setError(err.response?.data?.msg || 'Error en el servidor');
        } finally{
            setLoading(false);
        }
    };


    return (
        <Row className={styles['main-container']}>
            <Col className={styles['image-col']} md={5}>
                <div className={styles['image-container']}>
                    <img src="https://travelgrafia.co/wp-content/uploads/2023/06/Muelle-en-el-Lago-Atitlan.jpg" alt="" />
                </div>
            </Col>
            <Col md={7}>
                <Row className={styles['row']}>
                    <Col md={10}>
                        <Container className='d-flex justify-content-center mb-5'><h2>Iniciar sesión</h2></Container>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form>
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
                                <Form.Label>CONTRASEÑA</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="********"
                                    value={ password }
                                    onChange={ (e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Row className='pt-4'>
                                <Col>
                                    <button className={styles['disable-button']} type='button' onClick={()=>{
                                        navigate('/register')
                                    }}>
                                        Registrar
                                    </button>
                                </Col>
                                <Col>
                                    <button className={styles['enable-button']} type='button' disabled={loading || (!membershipNumber || !dpi || !birthdate || !password)} onClick={sendLogin} >
                                        {loading ? 'Ingresando...' : 'Ingresar'}
                                    </button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};


export default LoginPage;