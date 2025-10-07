import React, { createContext, useState } from 'react';
import api from '../axios';

export const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [candidatePositions, setCandidatePositions] = useState([]);
  const [measures, setMeasures] = useState([]);


  const getCampaigns = async (role) => {    
    try {
      const resp = await api.get('/campaign');
      if (resp.data && resp.data.ok) {
        let res = resp.data.msg;
        if(role === 1){
          res.push({campaign_id: res.length});
        }

        setCampaigns(res);
        return { ok: true, msg: resp.data.msg };
      }
      return { ok: false, msg: [] };
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      return { ok: false, msg: [] };
    }
  };

  const getEngineers = async ()=>{
    try {
      const resp = await api.get('/candidate');
      if(resp.data && resp.data.ok){
        setEngineers(resp.data.msg);
        return { ok: true, msg: resp.data.msg }
      }
      return { ok: false, msg: [] }
    } catch (error) {
      console.error("Error fetching engineers:", error);
      return { ok: false, msg: [] };
    }
  }

    const getCandidatePositions = async ()=>{
    try {
      const resp = await api.get('/candidate/candidate-positions');
      if(resp.data && resp.data.ok){
        setCandidatePositions(resp.data.msg);
        return { ok: true, msg: resp.data.msg }
      }
      return { ok: false, msg: [] }
    } catch (error) {
      console.error("Error fetching engineers:", error);
      return { ok: false, msg: [] };
    }
  }

    const getMeasures = async ()=>{
    try {
      const resp = await api.get('/candidate/measures');
      if(resp.data && resp.data.ok){
        setMeasures(resp.data.msg);
        return { ok: true, msg: resp.data.msg }
      }
      return { ok: false, msg: [] }
    } catch (error) {
      console.error("Error fetching engineers:", error);
      return { ok: false, msg: [] };
    }
  }

  return (
    <CampaignContext.Provider value={
      { 
        campaigns, getCampaigns, 
        engineers, getEngineers, 
        candidatePositions, getCandidatePositions,
        measures, getMeasures
      }
    }>
      {children}
    </CampaignContext.Provider>
  );
};
