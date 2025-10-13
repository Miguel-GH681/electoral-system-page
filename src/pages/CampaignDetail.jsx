import { useContext, useEffect, useRef, useState } from "react";
import { CampaignContext } from "../context/CampaignContext";
import { Card, CardBody, Container, Button, Row, Col } from "react-bootstrap";
import styles from "../styles/campaign.module.scss";
import detailStyles from '../styles/detail.module.scss'
import { BsFillPeopleFill } from "react-icons/bs";
import { FaVoteYea, FaCheckCircle  } from "react-icons/fa";
import ReactApexChart from 'react-apexcharts';
import { VoteSocket } from '../hooks/VoteSocket';

const CampaignDetail = ()=>{
    const { getCampaignDetail, getCandidatePositions, candidatePositions } = useContext(CampaignContext);
    const [header, setHeader] = useState({title: '', description: ''})
    const [positions, setPositions] = useState([]);
    const [positionSelected, setPositionSelected] = useState(0);
    const [candidates, setCandidates] = useState([]);
    const socket = VoteSocket("http://localhost:3000", localStorage.getItem("token"));
    const candidatesRef = useRef();
    candidatesRef.current = candidates;

    useEffect(() => {
        const fetchCampaignDetail = async () => {
          try {
            await getCandidatePositions();
            let resp = await getCampaignDetail(1);//obtener id dinamico
            setHeader(resp['campaign']);
            setCandidates(resp['candidates']);
            positionsFiltered(resp['candidates']);
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
            const updated = candidatesRef.current.map((cr) => {
                if (cr.membership_number === payload.candidate_id) {
                return { ...cr, votes: cr.votes + 1 };
                }
                return cr;
            });

            candidatesRef.current = updated;
            setCandidates(updated);
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
        text: 'Votaciones por candidato',
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


      const series1 = [70, 30]; // [votos emitidos, votos faltantes]

    const options1 = {
        labels: ["Votos Emitidos", "Votos Faltantes"],
        chart: {
            type: "donut",
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}%`,
        },
        legend: {
            position: "bottom",
        },
        plotOptions: {
            pie: {
                donut: {
                size: "60%", // Puedes quitarlo si quieres pie normal
                },
            },
        },
    };

    return <>
        <Container fluid className={styles['maintenance-container']}>
            <div className={styles['header']}>
                <div className={styles['header-data']}>
                    <p className={styles['header-title']}>{header.title}</p>
                    <p className={styles['header-description']}>{header.description}</p>  
                </div>
            </div>

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

            <Row xs={1} md={2} lg={3}>
                {
                candidates
                    .filter(d => d.candidate_position_id === positionSelected)
                    .map((d, index) => (
                        <Col key={index}>
                            <Card className={detailStyles['candidate-box']}>
                                <CardBody>
                                    <Row>
                                        <Col xs={12} sm={5} className={detailStyles['candidate-photo']}>
                                            <img src={d.photo} alt={d.full_name} height={200} />
                                        </Col>
                                        <Col xs={12} sm={7} className={detailStyles['candidate-data']}>
                                            <div>
                                                <p className={detailStyles['name']}>{d.full_name}</p>
                                                <hr />
                                                <p>{d.description}</p>
                                                <p>{d.email}</p>
                                                <p>{d.birthdate}</p>  
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

            <Row className="mt-5">
                <Col className="d-flex justify-content-between">
                    <div>
                        <p className={detailStyles['filter-title']}>Estadísticas</p>
                    </div>
                </Col>
            </Row>
            <div >
                <Card className={detailStyles['graph-container']}>
                    <CardBody>
                        <Row>
                            <Col>
                                <ReactApexChart options={options} series={series} type="bar" height={350} />
                            </Col>
                            <Col>
                                <ReactApexChart options={options1} series={series1} type="donut" height={350} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        </Container>   
    </>
}

export default CampaignDetail;