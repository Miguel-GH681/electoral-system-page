import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Form, Container, Row, Col, Alert } from 'react-bootstrap';
import styles from "../styles/login.module.scss";

const RegisterPage = ()=>{

    const [membershipNumber, setMembershipNumber] = useState('');
    const [dpi, setDpi] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const postUser = async ()=>{
        try {
            setLoading(true);
            const resp = await register(membershipNumber, fullname, email, dpi, birthdate, password);
            
            if(resp){
                setLoading(false);
                alert('Usuario creado con éxito');
                navigate('/login');
            }
        } catch (error : any) {
            setLoading(false);
            setError(error.response.data?.msg)
        }
    }

    return <>
        <Row className={styles['main-container']}>
            <Col md={5}>
                <div className={styles['image-container']}>
                    <img src="https://travelgrafia.co/wp-content/uploads/2023/06/Muelle-en-el-Lago-Atitlan.jpg" alt="" />
                </div>
            </Col>
            <Col md={7}>
                <Row className={styles['row']}>
                    <Col md={10}>
                        <Form>
                            <Container className='d-flex justify-content-center mb-5'><h2>Registro</h2></Container>
                            {error && <Alert variant="danger">{error}</Alert>}
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

                            <Form.Group className="mb-3" controlId="formFullname">
                                <Form.Label>NOMBRE COMPLETO</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="john doe"
                                    value={ fullname }
                                    onChange={ (e) => setFullname(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>CORREO ELECTRONICO</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="john.doe@gmail.com"
                                    value={ email }
                                    onChange={ (e) => setEmail(e.target.value)}
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
                                        navigate('/login')
                                    }}>
                                        Iniciar
                                    </button>
                                </Col>
                                <Col>
                                    <button type='button' disabled={loading || (!membershipNumber || !dpi || !birthdate || !password || !email || !fullname)} onClick={postUser}>
                                        { loading ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Col>
        </Row>
    </>
}

export default RegisterPage;