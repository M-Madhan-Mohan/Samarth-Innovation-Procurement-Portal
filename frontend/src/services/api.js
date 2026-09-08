// Samarth centralized API client — preserves the existing MIPP backend contract.

const API_BASE = "http://localhost:8000/api/v1";

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[Samarth API Error] Endpoint ${endpoint} failed:`, err);
    return null;
  }
}

export const api = {
  checkHealth: async () => {
    try {
      const res = await fetch("http://localhost:8000/");
      return res.ok;
    } catch {
      return false;
    }
  },

  generateChallengeCopilot: async (prompt) => {
    return await fetchApi("/mipp/challenges/generate-copilot", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
  },

  createChallenge: async (challengeData) => {
    return await fetchApi("/mipp/challenges", {
      method: "POST",
      body: JSON.stringify(challengeData),
    });
  },

  getChallenges: async () => {
    return await fetchApi("/mipp/challenges");
  },

  getMatchingStartups: async (challengeId) => {
    return await fetchApi(`/mipp/matching/challenge/${challengeId}`);
  },

  getStartupPassport: async (startupId) => {
    return await fetchApi(`/mipp/startups/${startupId}/passport`);
  },

  checkConflict: async (evaluatorId, applicationId, hasConflict) => {
    return await fetchApi("/mipp/evaluations/conflict-check", {
      method: "POST",
      body: JSON.stringify({ evaluator_id: evaluatorId, application_id: applicationId, has_conflict: hasConflict }),
    });
  },

  getPilotDetails: async (pilotId) => {
    return await fetchApi(`/mipp/pilots/${pilotId}`);
  },

  releaseMilestonePayment: async (pilotId, milestoneId) => {
    return await fetchApi(`/mipp/pilots/${pilotId}/milestones/${milestoneId}/release-payment`, {
      method: "POST",
    });
  },

  getEvidenceVerification: async (pilotId) => {
    return await fetchApi(`/mipp/evidence/pilot/${pilotId}`);
  },

  getScaleAndReplication: async (pilotId) => {
    return await fetchApi(`/mipp/scale/assessment/${pilotId}`);
  },

  getMlTransparency: async () => {
    return await fetchApi("/mipp/ml/transparency");
  },

  getDatasets: async () => {
    return await fetchApi("/mipp/ml/datasets");
  },

  retrainModels: async () => {
    return await fetchApi("/mipp/ml/retrain", { method: "POST" });
  }
};
