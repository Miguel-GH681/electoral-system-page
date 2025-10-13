import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CampaignContext } from "../context/CampaignContext";
import {Card, Row, Col, Button, Container} from 'react-bootstrap';
import styles from "../styles/campaign.module.scss";
import { useNavigate } from 'react-router-dom';
import { GrBook } from "react-icons/gr";
import { FaPlus, FaVoteYea } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";


const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { getCampaigns, campaigns } = useContext(CampaignContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        await getCampaigns(user.role_id);
      } catch (err) {
        console.error("Error al obtener campañas:", err);
      }
    };

    fetchCampaigns();
  }, []);

  const createCampaign = ()=>{
    navigate('/campaigns/maintenance')
  }

  return (
    <Container fluid className={styles['maintenance-container']}>
      <div className={styles['header']}>
        <div className={styles['header-data']}>
          <p className={styles['header-title']}>Campañas</p>
          <p className={styles['header-description']}>Seleccione una campaña para realizar su votación.</p>
        </div>

        <div>
          <Button className={styles['filter-button']}>Todas</Button>
          <Button className={styles['filter-button']}>Activas</Button>
          <Button className={styles['filter-button']}>Finalizadas</Button>
        </div>
      </div>

      {campaigns.length > 0 ? (
        <Row xs={1} md={2} lg={3}>
          {campaigns.map((c, index) => (
              c['campaign_id'] === 0 ?
              <Col key={c.campaign_id}>
                <Card className={styles['box-creation']} onClick={createCampaign}>    
                  <FaPlus size={40} className={styles['icon']}/>                  
                </Card>
              </Col> :
              <Col key={c.campaign_id}>
                <Card className={styles.box} onClick={
                  ()=>{navigate('/campaigns/detail')}
                }>
                  <Card.Body className="d-flex flex-column align-items-center">
                    <GrBook size={25}/>
                    <b>{c.title}</b>
                    <hr />
                    <div className={styles['text-container']}>
                      <p>{c.description}</p>
                    </div>
                    <Row className={styles['item-row']}>
                      <Col className={styles['item-col']}>
                        <BsFillPeopleFill />
                        <p>Candidatos</p>
                        <p>10</p>
                      </Col>
                      <Col className={styles['item-col']}>
                        <FaVoteYea />
                        <p>Votos</p>
                        <p>10</p>
                      </Col>
                    </Row>
                    <Row>
                      <button>
                        Ver detalle
                      </button>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
          ))}
        </Row>
      ) 
      : (
        <p>No hay campañas disponibles.</p>
      )}
    </Container>
  );
};

export default AdminDashboard;