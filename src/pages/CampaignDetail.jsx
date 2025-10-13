import React, { useContext, useEffect, useState } from "react";
import { CampaignContext } from "../context/CampaignContext";
import { Card, CardBody, Container, ButtonGroup, Button, Row, Col, Table } from "react-bootstrap";
import styles from "../styles/campaign.module.scss";
import detailStyles from '../styles/detail.module.scss'
import { BsFillPeopleFill } from "react-icons/bs";
import { FaVoteYea, FaCheckCircle  } from "react-icons/fa";
import ReactApexChart from 'react-apexcharts';

const CampaignDetail = ()=>{
    const { getCampaignDetail, getCandidatePositions, candidatePositions } = useContext(CampaignContext);
    const [header, setHeader] = useState({title: '', description: ''})
    const [positions, setPositions] = useState([]);
    const [positionSelected, setPositionSelected] = useState(0);
    const [candidatesFiltered, setCandidatesFiltered] = useState([]);
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const fetchCampaignDetail = async () => {
          try {
            await getCandidatePositions();
            let resp = await getCampaignDetail(1);//obtener id dinamico
            setHeader(resp['campaign']);
            setCandidates(resp['candidates']);
            positionsFiltered(resp['candidates']);
            changeFilter(resp['candidates'], 0)
          } catch (err) {
            console.error("Error al obtener campañas:", err);
          }
        };
    
        fetchCampaignDetail();
    }, []);

    const positionsFiltered = (c)=>{
        c.forEach((d)=>{
            if(!positions.find(p => p === d.candidate_position_id)){
                positions.push(d.candidate_position_id);
            }
        });
    }

    const changeFilter = (data, index) =>{ 
        let candidateFiltered = data.filter((d) => d.candidate_position_id === positions[index]);        
        setCandidatesFiltered(candidateFiltered);
        setPositionSelected(index);
    }

    const options = {
        chart: {
        id: 'ventas-bar-chart',
        toolbar: { show: true }, // Muestra el toolbar con opciones
        },
        xaxis: {
        categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'], // Etiquetas del eje X
        },
        title: {
        text: 'Votaciones por candidato',
        align: 'center',
        style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
        },
        },
        colors: ['#406da8'], // Color de las barras
    };

    const series = [
        {
        name: 'Ventas',
        data: [400, 300, 500, 200, 600], // Valores de cada barra
        },
    ];

    return <>
        <Container fluid className={styles['maintenance-container']}>
            <div className={styles['header']}>
                <div className={styles['header-data']}>
                    <p className={styles['header-title']}>{header.title}</p>
                    <p className={styles['header-description']}>{header.description}</p>  
                </div>
            </div>

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
                                    <BsFillPeopleFill size={75}/>
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
                                    <p>Votos</p>
                                    <p>20</p>
                                </div>
                                <div>
                                    <FaVoteYea size={75}/>
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
                                    <p>Votos restantes</p>
                                    <p>2</p>
                                </div>
                                <div>
                                    <FaCheckCircle size={75}/>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col className="d-flex justify-content-between">
                    <div>
                        <p className={styles['filter-title']}>Candidatos</p>
                    </div>
                    <div>
                        {
                            positions.map((p, index)=>(
                                <button key={index}  
                                className={
                                    positionSelected == index ?
                                    styles['filter-button-selected'] :
                                    styles['filter-button']
                                } 
                                onClick={()=>{
                                    changeFilter(candidates, index);
                                }}>
                                    {candidatePositions.find(cp => cp['position_id'] === p)['description']}
                                </button>
                            ))
                        }
                    </div>
                </Col>
            </Row>

            <Row>
                    {
                        candidatesFiltered.map((d, index)=>(
                            <Col key={index} lg={4} md={6} xs={12}>
                                <Card className={detailStyles['candidate-box']}>
                                    <CardBody>
                                        <Row>
                                            <Col xxl={4} className={detailStyles['candidate-photo']}>
                                                <img src={d.photo} alt="" height={200}/>
                                            </Col>
                                            <Col xxl={8} className={detailStyles['candidate-data']}>
                                                <p className={detailStyles['name']}>{d.full_name}</p>
                                                <p>{d.description}</p>
                                                <div>
                                                    <div xs={6}>
                                                        <p>Email: {d.email}</p>
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
                        ))
                    }
            </Row>

            <Row className={styles['graph-container']}>
                <ReactApexChart options={options} series={series} type="bar" height={350} />
            </Row>
        </Container>   
    </>
}

export default CampaignDetail;