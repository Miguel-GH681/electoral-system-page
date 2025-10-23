import React, { createContext, useState } from 'react';
import api from '../axios';

export const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [candidatePositions, setCandidatePositions] = useState([]);
  const [campaignState, setCampaignState] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [report, setReport] = useState([]);
  const [result, setResult] = useState([]);

  const getCampaigns = async (role) => {    
    try {
      const resp = await api.get('/campaign');
      if (resp.data && resp.data.ok) {
        let res = resp.data.msg;
        if(role === 1){
          res.push({campaign_id: 0, campaign_state_id: 1});
        }

        setCampaigns(res);
        return resp.data.msg;
      }
      return { ok: false, msg: [] };
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      return { ok: false, msg: [] };
    }
  };

  const updateCampaign = async (campaign_id, campaign_state_id) =>{
    try {
      const resp = await api.put('/campaign/' + campaign_id, {
        campaign_state_id
      });
      return {ok: true, msg: resp.data.msg}
    } catch (error) {
      console.error("Error updating campaign:", error);
      return { ok: false, msg: [] };
    }
  }

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

  const getCampaignState = async ()=>{
    try {
      const resp = await api.get('/campaign/state');
      if(resp.data && resp.data.ok){
        setCampaignState(resp.data.msg);
      }
    } catch (error) {
      console.error("Error fetching engineers:", error);
      return { ok: false, msg: [] };
    }
  }

  const postCampaign = async (campaign)=>{
    console.log(campaign);
    
    try {
      const resp = await api.post('/campaign', campaign);
      if(resp.data && resp.data.ok){
        return resp.data.msg
      }

      return {ok:true, msg: 0}
    } catch (error) {
      console.error("Error post campaign:", error);
      return { ok: false, msg: null };      
    }
  }

  const postCandidates = async(candidate)=>{
    try {
      const resp = await api.post('/candidate', candidate);
      if(resp.data && resp.data.ok){
        return {ok:true, msg: []}
      }
    } catch (error) {
      console.error("Error post candidate:", error);
      return { ok: false, msg: null };
    }
  }

  const getCampaignDetail = async(campaignId)=>{
    try {
      const resp = await api.get('/campaign/' + campaignId);
      if(resp.data && resp.data.ok){
        return resp.data.msg
      }
    } catch (error) {
      console.error("Error getDetailCampaign:", error);
      return { ok: false, msg: null };
    }
  }

  const getReport = async(campaignId)=>{
    try {
      const resp = await api.get('/campaign/report/' + campaignId);
      if(resp.data && resp.data.ok){
        setReport(resp.data.msg);
      }
    } catch (error) {
      console.error("Error getDetailCampaign:", error);
      return { ok: false, msg: [] };
    }
  }

  const getResult = async(campaignId) =>{
    try {
      const resp = await api.get('/campaign/result/' + campaignId);
      if(resp.data && resp.data.ok){
        setResult(resp.data.msg);
      }
    } catch (error) {
      console.error("Error getDetailCampaign:", error);
      return { ok: false, msg: [] };
    }
  }

  return (
    <CampaignContext.Provider value={
      { 
        campaigns, getCampaigns, 
        engineers, getEngineers, 
        candidatePositions, getCandidatePositions,
        campaignState, getCampaignState,
        measures, getMeasures,
        report, getReport,
        result, getResult,
        postCampaign,
        postCandidates,
        getCampaignDetail,
        updateCampaign
      }
    }>
      {children}
    </CampaignContext.Provider>
  );
};
