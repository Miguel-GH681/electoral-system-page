import React, { useContext, useEffect, useState } from "react";
import { CampaignContext } from "../context/CampaignContext";
import { Card, CardBody, Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import styles from "../styles/styles.module.scss";
import detailStyles from '../styles/detail.module.scss'
import { BsFillPeopleFill } from "react-icons/bs";
import { FaVoteYea, FaCheckCircle  } from "react-icons/fa";

const CampaignDetail = ()=>{
    return <>
        <Container fluid className={styles['maintenance-container']}>
            <p className={detailStyles['title']}>Elecciones 2025</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, architecto odit? Non quaerat ea quae magni distinctio! Assumenda incidunt atque nobis tempora sed magni alias. Consectetur laborum in perferendis esse!</p>    

            <Row>
                <Col lg={4}>
                    <Card className={detailStyles['box']}>
                        <CardBody>
                            <div className={detailStyles['header-row']}>
                                <div className={[detailStyles['data-rows']]}>
                                    <p>Candidatos</p>
                                    <p>20</p>
                                </div>
                                <div>
                                    <BsFillPeopleFill size={100}/>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className={detailStyles.box}>
                        <CardBody>
                            <div className={detailStyles['header-row']}>
                                <div className={[detailStyles['data-rows']]}>
                                    <p>Candidatos</p>
                                    <p>20</p>
                                </div>
                                <div>
                                    <BsFillPeopleFill size={100}/>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className={detailStyles.box}>
                        <CardBody>
                            <div className={detailStyles['header-row']}>
                                <div className={[detailStyles['data-rows']]}>
                                    <p>Candidatos</p>
                                    <p>20</p>
                                </div>
                                <div>
                                    <BsFillPeopleFill size={100}/>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <p>Candidatos</p>
                </Col>
            </Row>

            <Row>
                <Col lg={4} md={6} xs={12}>
                    <Card className={detailStyles['candidate-box']}>
                        <CardBody>
                            <Row>
                                <Col xxl={4} className={detailStyles['candidate-photo']}>
                                    <img src="https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000" alt="" height={200}/>
                                </Col>
                                <Col xxl={8} className={detailStyles['candidate-data']}>
                                    <p>Alvaro Miguel Gonzalez Hic</p>
                                    <p>Lorem ipsum dolor sit, amet consecsunt repellendus veniam.</p>
                                    <div>
                                        <div xs={6}>
                                            <p>Email: jonh.doe@gmail.com</p>
                                        </div>
                                        <div xs={6}>
                                            <p>Edad: 26 anios</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>   
    </>
}

export default CampaignDetail;