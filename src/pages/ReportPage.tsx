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
    const { 
        getCampaignDetail, 
        getCandidatePositions, 
        candidatePositions, 
        updateCampaign, 
        campaignState, 
        getCampaignState, 
        report, 
        getReport,
        result,
        getResult,
        terminateCampaign
    } = useContext(CampaignContext);
    const [header, setHeader] = useState({title: '', description: ''})
    const [candidates, setCandidates] = useState<any[]>([]);
    const [state, setState] = useState(0);
    const candidatesRef = useRef<any[] | null>(null);
    candidatesRef.current = candidates;

    const {
        seconds,
        minutes,
        hours,
        restart
    } = useTimer({
        expiryTimestamp: new Date(), 
        autoStart: false,
        onExpire: async () => {
            await terminateCampaign(campaign_id);
            setState(4);
        }, 
        interval: 20 
    });
 
    useEffect(() => {
        const fetchCampaignDetail = async () => {
          try {
            await getCandidatePositions();
            await getCampaignState();
            await getResult(campaign_id);
            await getReport(campaign_id);
            let resp = await getCampaignDetail(campaign_id);
            setHeader(resp['campaign']);
            setCandidates(resp['candidates']);
            if(resp['endDate'] != "Invalid Date"){
               restart(new Date(resp['endDate'].replace(' ', 'T'))); 
            }
            setState(resp['campaign']['campaign_state_id'])
          } catch (err) {
            console.error("Error al obtener campañas:", err);
          }
        };
    
        fetchCampaignDetail();
    }, []);

    const updateState = async ()=>{
        const resp = await updateCampaign(campaign_id, state);
        if(resp['msg']){
            console.log({tiempo: resp['msg']});
            
            restart(new Date(resp['msg'].replace(' ', 'T')));
        }
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
        align: "center" as const,
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
                                            <Form.Select value={state} onChange={(e)=>{setState(Number(e.target.value))}}>
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
            <Card className={detailStyles['winners-container']}>
                <CardBody>
                    <Row>
                        <Col>
                            <p>Ganadores</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className={styles['table-responsive-container']}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Fotografía</th>
                                            <th>Nombre</th>
                                            <th>Posición</th>
                                            <th>Votos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        result.length > 0 ?
                                        result.map((r, index) =>(
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="d-flex justify-content-center">
                                                    <img src={r.photo} alt={r.candidate_name} height={80}/>
                                                </td>
                                                <td>{r.candidate_name}</td>
                                                <td>{r.position_description}</td>
                                                <td>{r.total_votes}</td>
                                            </tr>
                                        )) : null
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Row>
                        <Col>
                            <p>Votantes</p>
                        </Col>
                    </Row>
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