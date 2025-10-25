import React, { useContext, useEffect, useState } from "react";
import { CampaignContext } from "../context/CampaignContext";
import { Card, CardBody, Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import styles from "../styles/campaign.module.scss";
import { ToastContainer, toast } from "react-toastify";

const CreateCampaign = ()=>{

  const { getEngineers, engineers, getCandidatePositions, candidatePositions, getMeasures, measures, postCampaign, postCandidates } = useContext(CampaignContext);
  
  const [diplomaDescription, setDiplomaDescription] = useState('');
  const [graduationYear, setGraduationYear] = useState(0);
  const [diplomaTitle, setDiplomaTitle] = useState('');
  const [institution, setInstitution] = useState('');
  type Diploma = {
    title: string;
    description: string;
    graduation_year: number;
    institution: string;
    candidate_id: number;
  };
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [engineer, setEngineer] = useState(0);
  const [position, setPosition] = useState(0);
  const [measure, setMeasure] =  useState(0);
  const [headerStatus, setHeaderStatus] = useState(false);
  const [campaignId, setCampaignId ] = useState(0);
  const [campaingName, setCampaignName] = useState('');
  const [campaingDescription, setCampaignDescription] = useState('');
  const [campaingDuration, setCampaignDuration] = useState(0);
  const [campaingVotes, setCampaingVotes] = useState(0);
  const [candidateDescription, setCandidateDescription] = useState('');
  const [candidatePhoto, setCandidatePhoto] = useState('');
  type Candidate = {
    membership_number: number;
    campaign_id: number;
    description: string;
    photo: string;
    candidate_position_id: number;
    diplomas: Diploma[];
  };
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        await getEngineers();
        await getCandidatePositions();
        await getMeasures();
      } catch (err) {
        console.error("Error al obtener información:", err);
      }
    };

    fetchData();
  }, []);

  const getBase64 = (e : any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setCandidatePhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveDiploma = (e : any)=>{
    if(diplomaTitle === '' || diplomaDescription === '' || graduationYear === 0 || 
       institution === '' || engineer === 0 || position === 0 || candidateDescription === '' || candidatePhoto === ''){
      alert('Todos los campos son obligatorios')
      return ''
    }

    setDiplomas([
      ...diplomas,
      {
        title: diplomaTitle,
        description: diplomaDescription,
        graduation_year: graduationYear,
        institution: institution,
        candidate_id: engineer
      }
    ]);

    setDiplomaTitle('');
    setDiplomaDescription('');
    setGraduationYear(0);
    setInstitution('')
  }

  const saveCampaignHeader = async ()=>{
    if(campaingName === '' || campaingDescription === '' || campaingDuration === 0 || measure === 0){
      toast('Todos los campos son obligatorios')
      return ''
    }

    let newCampaingId = await postCampaign({
      'title': campaingName,
      'description': campaingDescription,
      'campaign_state_id': 1,
      'duration': campaingDuration,
      'measure_id': measure,
      'votes': campaingVotes
    })
    setCampaignId(newCampaingId);
    setHeaderStatus(true);
  }

  const saveCandidate = async ()=>{
    if(engineer === 0 || position === 0 || candidateDescription === '' || candidatePhoto === ''){
      alert('Todos los campos son obligatorios')
      return ''
    }

    const newCandidate = 
    {
      'membership_number': engineer,
      'campaign_id': campaignId,
      'description': candidateDescription,
      'photo': candidatePhoto,
      'candidate_position_id': position,
      'diplomas': diplomas
    }

    setCandidates([...candidates, newCandidate]);
    await postCandidates(newCandidate);
    cleanFields();    
  }

  const cleanFields = ()=>{
    setDiplomas([]);
    setEngineer(0)
    setCandidateDescription('');
    setCandidatePhoto('');
    setPosition(0);
  }

  const handleMeasureChange = (e :any)=>{
    setMeasure(e.target.value);
  }

  const handleEngineerChange = (e : any)=>{
    setEngineer(e.target.value);
  }

  const handlePositionChange = (e : any)=>{
    setPosition(e.target.value);
  }

  return <>
    <Container fluid className={styles['maintenance-container']}>
      <h3>Creación de campañas</h3>
      <Card className={styles['form-card']}>
        <CardBody>
          <Form>
            <Row xs={1} md={2}>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Nombre de la campaña" 
                    value={campaingName} 
                    onChange={(e)=> setCampaignName(e.target.value)}
                    disabled={headerStatus}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Descripción" 
                    value={campaingDescription} 
                    onChange={(e)=> setCampaignDescription(e.target.value)}
                    disabled={headerStatus}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row xs={1} md={3}>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Medida</Form.Label>
                  <Form.Select value={measure} onChange={handleMeasureChange} disabled={headerStatus}>
                    <option value="">Selecciona una medida</option>
                    {
                      measures.map((m)=>(
                        <option key={m.measure_id} value={m.measure_id} >
                          {m.description}
                        </option>
                      ))
                    }
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Duración</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Tiempo de duración" 
                    value={campaingDuration} onChange={(e)=> setCampaignDuration(Number(e.target.value))}
                    disabled={headerStatus}
                  />
                </Form.Group>
              </Col>


              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Votos</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Tiempo de duración" 
                    value={campaingVotes} onChange={(e)=> setCampaingVotes(Number(e.target.value))}
                    disabled={headerStatus}
                  />
                </Form.Group>
              </Col>
            </Row>
            {
              headerStatus ?
              null :
              <Row className="d-flex justify-content-end">
                <Col xs={3}>
                  <button type="button" className={styles['state-button']} onClick={saveCampaignHeader}>
                    Guardar
                  </button>
                  <ToastContainer />
                </Col>
              </Row>
            }
          </Form>
        </CardBody>
      </Card>

      {
      headerStatus ?
        <div>
          <br />
          <h3>Candidatos</h3>
          <Card className={styles['form-card']}>
            <CardBody>
              <Form>
                <Row xs={1} md={2}>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Ingeniero(a)</Form.Label>
                      <Form.Select value={engineer} onChange={handleEngineerChange}>
                        <option value="">Selecciona una opción</option>
                        {
                          engineers.map((e)=>(
                            <option key={e.membership_number} value={e.membership_number} >
                              {e.full_name}
                            </option>
                          ))
                        }
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Puesto</Form.Label>
                      <Form.Select value={position} onChange={handlePositionChange}>
                        <option value="">Selecciona un puesto</option>
                        {
                          candidatePositions.map((p)=>(
                            <option key={p.position_id} value={p.position_id} >
                              {p.description}
                            </option>
                          ))
                        }
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row xs={1} md={2}>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Características del candidato" 
                        value={candidateDescription}
                        onChange={(e)=> setCandidateDescription(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Foto</Form.Label>
                      <Form.Control 
                        type="file" 
                        placeholder="Foto" 
                        accept="image/*"
                        onChange={getBase64}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <h5>Títulos académicos ({ diplomas.length })</h5>
                  </Col>
                  <Col md={3} className="d-flex justify-content-end mb-2">
                    <button type="button" className={styles['state-button']} onClick={saveDiploma}>
                      Agregar título
                    </button>
                  </Col>
                </Row>
                <div>
                  <Row xs={1} md={2}>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Nombre del título" 
                          value={diplomaTitle}
                          onChange={(e)=> setDiplomaTitle(e.target.value)}
                          />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Descripción"
                          value={diplomaDescription}
                          onChange={(e)=> setDiplomaDescription(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row xs={1} md={2}>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Año</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Año de graduación" 
                          value={graduationYear}
                          onChange={(e)=> setGraduationYear(Number(e.target.value))}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Institución</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Nombre de la institución" 
                          value={institution}
                          onChange={(e)=> setInstitution(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                <br />
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Título</th>
                      <th>Año</th>
                      <th>Institución</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      diplomas.length > 0 ?
                      diplomas.map((d, index) =>(
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{d.title}</td>
                          <td>{d.graduation_year}</td>
                          <td>{d.institution}</td>
                        </tr>
                      )) : null
                    }
                  </tbody>
                </Table>
                <hr />
                <Row className="d-flex justify-content-end">
                  <Col md={3}>
                    <button type="button" className={styles['state-button']} onClick={saveCandidate}>
                      Guardar candidato
                    </button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </div> : null
      }

      {
        candidates.length > 0 ?
        <div>
          <br />
          <h3>Candidatos ingresados</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No. Colegiado</th>
                <th>Nombre</th>
                <th>Posición</th>
                <th>Títulos</th>
              </tr>
            </thead>
            <tbody>
              {
                candidates.length > 0 ?
                candidates.map((d, index) =>(
                  <tr key={index}>
                    <td>{d.membership_number}</td>
                    <td>{engineers.find((e)=> e.membership_number == d.membership_number)['full_name']}</td>
                    <td>{candidatePositions.find((p)=> p.position_id == d.candidate_position_id)['description']}</td>
                    <td>{d.diplomas.length}</td>
                  </tr>
                )) : null
              }
            </tbody>
          </Table>
        </div> : null
      }
    </Container>
  </>
}

export default CreateCampaign;