import { useContext, useEffect, useRef, useState } from "react";
import { CampaignContext } from "../context/CampaignContext";
import { Card, CardBody, Container, Button, Row, Col } from "react-bootstrap";
import styles from "../styles/campaign.module.scss";
import detailStyles from '../styles/detail.module.scss'
import ReactApexChart from 'react-apexcharts';
import { VoteSocket } from '../hooks/VoteSocket';
import { useTimer } from 'react-timer-hook';

const CampaignDetail = ()=>{
    const { getCampaignDetail, getCandidatePositions, candidatePositions } = useContext(CampaignContext);
    const [header, setHeader] = useState({title: '', description: ''})
    const [positions, setPositions] = useState([]);
    const [positionSelected, setPositionSelected] = useState(0);
    const [candidates, setCandidates] = useState([]);
    const socket = VoteSocket("http://localhost:3000", localStorage.getItem("token"));
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
            let resp = await getCampaignDetail(1);
            setHeader(resp['campaign']);
            setCandidates(resp['candidates']);
            positionsFiltered(resp['candidates']);
            restart(new Date(resp['endDate'].replace(' ', 'T')))
          } catch (err) {
            console.error("Error al obtener campañas:", err);
          }
        };
    
        fetchCampaignDetail();
    }, []);

    useEffect(() =>{
        if(!socket){
            return
        }

        socket.on('vote', (payload) => {
            if(payload){
                const updated = candidatesRef.current.map((cr) => {
                    if (cr.membership_number === payload.candidate_id) {
                    return { ...cr, votes: cr.votes + 1 };
                    }
                    return cr;
                });

                candidatesRef.current = updated;
                setCandidates(updated);
            } else{
                alert('voto no autorizado')
            }
        });


        return ()=>{
            socket.off('vote');
        }
    }, [socket])

    const positionsFiltered = (c)=>{
        let pos = [];

        c.forEach((d)=>{
            if(!pos.find(p => p === d.candidate_position_id)){
                pos.push(d.candidate_position_id);
            }
        });
        setPositions(pos);
        setPositionSelected(pos[0]);
    }

    const sendVote = (candidate_id)=>{
        let userData = JSON.parse(localStorage.getItem('user'));

        if(!socket){
            return
        }

        socket.emit('vote', {
            candidate_id,
            voter_id: userData['membership_number'],
            candidate_position_id: positionSelected,
            vote_date: new Date()
        });
    }

    const options = {
        chart: {
        id: 'ventas-bar-chart',
        toolbar: { show: false },
        },
        xaxis: {
        categories: candidates.filter(c => c.candidate_position_id == positionSelected).map((c) => c.full_name),
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
        data: candidates.filter(c => c.candidate_position_id == positionSelected).map(c => c.votes),
        },
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
                                <div>
                                    <p>Tiempo Restante</p>
                                    <div className={detailStyles['header-campaign-timer']}>
                                        <div>{hours.toString().length == 1 ? '0' + hours : hours}</div>:
                                        <div>{minutes.toString().length == 1 ? '0' + minutes : minutes}</div>:
                                        <div>{seconds.toString().length == 1 ? '0' + seconds : seconds}</div>
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

            <Row className="mt-5">
                <Col className="d-flex justify-content-between">
                    <div>
                        <p className={detailStyles['filter-title']}>Candidatos</p>
                    </div>
                    <div>
                        {
                            positions.map((p, index)=>(
                                <button key={index}  
                                className={
                                    positionSelected == p ?
                                    styles['filter-button-selected'] :
                                    styles['filter-button']
                                } 
                                onClick={()=>{
                                    setPositionSelected(p)
                                }}>
                                    { candidatePositions.find((cp) => cp['position_id'] == p)['description'] }
                                </button>
                            ))
                        }
                    </div>
                </Col>
            </Row>

            <Row xs={1} md={2} xl={3}>
                {
                candidates
                    .filter(d => d.candidate_position_id === positionSelected)
                    .map((d, index) => (
                        <Col key={index}>
                            <Card className={detailStyles['candidate-box']}>
                                <CardBody>
                                    <Row>
                                        <Col xs={12}  sm={5} className={detailStyles['candidate-photo']}>
                                            <img src={d.photo} alt={d.full_name} />
                                        </Col>
                                        <Col xs={12} sm={7} >
                                            <div className={detailStyles['candidate-data']}>
                                                <div className={detailStyles['candidate-data-header']}>
                                                    <p>{d.full_name}</p>
                                                    <hr />
                                                </div>
                                                <div className={detailStyles['candidate-data-body']}>
                                                    <p>{d.description}</p>
                                                    <p>{d.email}</p>
                                                    <p>{d.birthdate}</p>  
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                className={styles['box-button']}
                                                onClick={() => sendVote(d.membership_number)}
                                                >
                                                Votar
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </Container>   
    </>
}

export default CampaignDetail;