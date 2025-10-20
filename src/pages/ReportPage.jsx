import { useContext, useEffect, useRef, useState } from "react";
import { CampaignContext } from "../context/CampaignContext";
import { Card, CardBody, Container, Button, Row, Col, Table, Form } from "react-bootstrap";
import styles from "../styles/campaign.module.scss";
import detailStyles from '../styles/detail.module.scss'
import ReactApexChart from 'react-apexcharts';
import { useTimer } from 'react-timer-hook';
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";

const ReportPage = ()=>{
    const { campaign_id } = useParams();
    const { getCampaignDetail, getCandidatePositions, candidatePositions, updateCampaign, campaignState, getCampaignState, report, getReport } = useContext(CampaignContext);
    const [header, setHeader] = useState({title: '', description: ''})
    const [candidates, setCandidates] = useState([]);
    const [state, setState] = useState(0);
    const candidatesRef = useRef();
    candidatesRef.current = candidates;

    const {
        seconds,
        minutes,
        hours,
        restart
    } = useTimer({
        expiryTimestamp: new Date(), 
        autoStart: false,
        onExpire: () => console.warn('onExpire called'), 
        interval: 20 
    });
 
    useEffect(() => {
        const fetchCampaignDetail = async () => {
          try {
            await getCandidatePositions();
            await getCampaignState();
            await getReport(campaign_id);
            let resp = await getCampaignDetail(campaign_id);
            setHeader(resp['campaign']);
            setCandidates(resp['candidates']);
            restart(new Date(resp['endDate'].replace(' ', 'T')));
            setState(resp['campaign']['campaign_state_id'])
          } catch (err) {
            console.error("Error al obtener campañas:", err);
          }
        };
    
        fetchCampaignDetail();
    }, []);

    const updateState = async ()=>{
        const resp = await updateCampaign(campaign_id, state);
        restart(new Date(resp['msg'].replace(' ', 'T')));
        toast('Estado actualizado exitosamente');
    }

    const options = {
        chart: {
        id: 'ventas-bar-chart',
        toolbar: { show: false },
        },
        xaxis: {
            categories: candidates.map((c) => c.full_name),
        },
        title: {
        text: 'Votaciones',
        align: 'center',
        style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
        },
        },
        colors: ['#406da8'],
    };

    const series = [
        {
            name: 'Votos',
            data: candidates.map(c => c.votes),
        }
    ];

    return <>
        <Container fluid className={styles['maintenance-container']}>
            <Card className={detailStyles['graph-container']}>
                <CardBody>
                    <Row>
                        <Col lg={6}>
                            <div className={detailStyles['header-campaign']}>
                                <p className={detailStyles['header-campaign-title']}>{header.title}</p>
                                <p className={detailStyles['header-campaign-description']}>{header.description}</p>  
                                <div className={detailStyles['header-campaign-state']}>
                                    <div>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Cambiar Estado</Form.Label>
                                            <Form.Select value={state} onChange={(e)=>{setState(e.target.value)}}>
                                            <option value="">Selecciona un estado</option>
                                            {
                                                campaignState.map((p)=>(
                                                <option key={p.campaign_state_id} value={p.campaign_state_id} >
                                                    {p.description}
                                                </option>
                                                ))
                                            }
                                            </Form.Select>
                                        </Form.Group>
                                        <button type="button" className={styles['state-button']} onClick={updateState}>
                                            Aceptar
                                        </button>
                                        <ToastContainer />
                                    </div>
                                    <div>
                                        <p>Tiempo Restante</p>
                                        <div className={detailStyles['header-campaign-timer']}>
                                            <div>{hours.toString().length == 1 ? '0' + hours : hours}</div>:
                                            <div>{minutes.toString().length == 1 ? '0' + minutes : minutes}</div>:
                                            <div>{seconds.toString().length == 1 ? '0' + seconds : seconds}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <ReactApexChart options={options} series={series} type="bar" height={300}/>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Row>
                        <Col>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Nombre</th>
                                        <th>Fecha</th>
                                        <th>Posición</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                    report.length > 0 ?
                                    report.map((d, index) =>(
                                        <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{d.full_name}</td>
                                        <td>{d.vote_date}</td>
                                        <td>{d.candidate_position}</td>
                                        </tr>
                                    )) : null
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Container>
    </>
}

export default ReportPage;