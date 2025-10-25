import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import { useContext, useEffect, useState } from "react";
import { FaPlus, FaVoteYea } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { GrBook } from "react-icons/gr";

import { CampaignContext } from "../context/CampaignContext";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/campaign.module.scss";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { getCampaigns, campaigns, getCampaignState, campaignState } = useContext(CampaignContext);

  const [states, setStates] = useState<number[]>([]);
  const [stateSelected, setStateSelected] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        await getCampaignState();
        let resp = await getCampaigns(user.role_id);
        statesFiltered(resp)
      } catch (err) {
        console.error("Error al obtener campañas:", err);
      }
    };

    fetchCampaigns();
  }, []);

  const statesFiltered = (c : any)=>{
    let stt : number[] = [];

    c.forEach((d : any)=>{
        if(!stt.find(p => p === d.campaign_state_id)){
            stt.push(d.campaign_state_id);
        }
    });
    setStates(stt);
    setStateSelected(stt[0]);
  }

  const createCampaign = ()=>{
    navigate('/campaigns/maintenance');
  }

  return (
    <Container fluid className={styles['maintenance-container']}>
      <div className={styles['header']}>
        <div className={styles['header-data']}>
          <p className={styles['header-title']}>Campañas</p>
          <p className={styles['header-description']}>Seleccione una campaña para realizar su votación.</p>
        </div>

        <div className={styles['button-container']}>
          {
              states.map((p, index)=>(
                  <button key={index}  
                  className={
                      stateSelected == p ?
                      styles['filter-button-selected'] :
                      styles['filter-button']
                  } 
                  onClick={()=>{
                      setStateSelected(p)
                  }}>
                      { campaignState.find((cp) => cp['campaign_state_id'] == p)['description'] }
                  </button>
              ))
          }
        </div>
      </div>

      {campaigns.length > 0 ? (
        <Row xs={1} md={2} lg={2} xl={3}>
          {
            campaigns.filter(c => c.campaign_state_id == stateSelected).map((c, index) => (
              c['campaign_id'] === 0 ?
              <Col key={c.campaign_id}>
                <Card className={styles['box-creation']} onClick={createCampaign}>    
                  <FaPlus className={styles['icon']}/>                  
                </Card>
              </Col> :
              <Col key={c.campaign_id}>
                <Card className={styles.box}>
                  <Card.Body className="d-flex flex-column align-items-center justify-content-around">
                    <Row className={styles['header-box']}>
                      <GrBook />
                      <b className={styles['box-title']}>{c.title}</b>
                      <hr />
                      <div className={styles['box-description']}>
                        <p>{c.description}</p>
                      </div>
                    </Row>
                    <Row className={styles['item-row']}>
                      <Col className={styles['item-col']}>
                        <BsFillPeopleFill />
                        <p>Candidatos</p>
                        <p>{c.candidates}</p>
                      </Col>
                      <Col className={styles['item-col']}>
                        <FaVoteYea />
                        <p>Votos</p>
                        <p>{c.voted}/{c.votes}</p>
                      </Col>
                    </Row>
                    <Row className={styles['box-button']}>
                      <button onClick={
                        ()=>{
                          if(user.role_id == 1){
                            navigate('/campaign/report/' + c.campaign_id);
                          } else{
                            if(c.campaign_state_id == 2){
                              navigate('/campaigns/detail/' + c.campaign_id);
                            } else{
                              toast('La campaña no esta disponible');
                            }
                          }
                        }
                      }>
                        Ver detalle
                      </button>
                      <ToastContainer />
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))
          }
        </Row>
      ) 
      : (
        <p>No hay campañas disponibles.</p>
      )}
    </Container>
  );
};

export default AdminDashboard;