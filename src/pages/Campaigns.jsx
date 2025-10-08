import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CampaignContext } from "../context/CampaignContext";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from "../styles/styles.module.scss";
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
    <div style={{ padding: 40 }}>
      {campaigns.length > 0 ? (
        <Row xs={1} md={2} lg={3}>
          {campaigns.map((c, index) => (
              index === (campaigns.length - 1) ?
              <Col key={c.campaign_id}>
                <Card className={styles['box-creation']} onClick={createCampaign}>    
                  <FaPlus color="white" size={40}/>                  
                </Card>
              </Col> :
              <Col key={c.campaign_id}>
                <Card className={styles.box}>
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
                  </Card.Body>
                </Card>
              </Col>
          ))}
        </Row>
      ) 
      : (
        <p>No hay campañas disponibles.</p>
      )}
    </div>
  );
};

export default AdminDashboard;