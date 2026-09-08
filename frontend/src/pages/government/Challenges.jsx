import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovernmentLayout from '../../layouts/GovernmentLayout';
import { MOCK_CHALLENGES } from '../../data/mockData';
import GovernmentChallengeCard from '../../components/government/ChallengeCard';
import Button from '../../components/common/Button';
import { PlusCircle } from 'lucide-react';
import { api } from '../../services/api';

const GovernmentChallenges = ({ currentUser, onRoleChange }) => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const loadChallenges = async () => {
      setLoading(true);
      setLoadError('');
      const result = await api.getChallenges();
      if (!active) return;
      if (Array.isArray(result)) {
        // The API owns published records. Normalize optional card fields so a
        // newly-created challenge renders safely even before applications exist.
        setChallenges(result.map((challenge) => ({
          ...challenge,
          targetDistricts: Array.isArray(challenge.targetDistricts)
            ? challenge.targetDistricts
            : Array.isArray(challenge.brief?.target_locations)
              ? challenge.brief.target_locations
              : [challenge.brief?.target_locations || 'To be confirmed'],
          applicantCount: Number(challenge.applicantCount || 0),
          evaluatorsAssigned: Number(challenge.evaluatorsAssigned || 0),
        })));
      } else {
        setLoadError('We could not load published challenges. Check the backend and retry.');
        setChallenges(MOCK_CHALLENGES.map((challenge) => ({ ...challenge, isDemo: true })));
      }
      setLoading(false);
    };
    loadChallenges();
    return () => { active = false; };
  }, []);

  return (
    <GovernmentLayout currentUser={currentUser} onRoleChange={onRoleChange}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#0B2545', marginBottom: '0.25rem' }}>
            State Department Challenges
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Manage active problem statements, view incoming applicant numbers, and track evaluation progress.
          </p>
        </div>

        <Button variant="saffron" icon={PlusCircle} onClick={() => navigate('/government/create-challenge')}>
          Post New Challenge
        </Button>
      </div>

      {loadError && <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{loadError}</div>}
      {loading ? (
        <div className="ui-card text-sm text-slate-500">Loading published challenges…</div>
      ) : challenges.length === 0 ? (
        <div className="ui-card text-center py-12">
          <h2 className="text-lg font-bold">No challenges published yet</h2>
          <p className="mt-2 text-sm text-slate-500">Post a challenge to make it visible to startups.</p>
          <Button variant="primary" icon={PlusCircle} className="mt-4" onClick={() => navigate('/government/create-challenge')}>Post a Challenge</Button>
        </div>
      ) : <div className="cards-grid">
        {challenges.map((ch) => (
          <GovernmentChallengeCard
            key={ch.id}
            challenge={ch}
            onViewApplications={(c) => navigate('/government/applications')}
          />
        ))}
      </div>}
    </GovernmentLayout>
  );
};

export default GovernmentChallenges;
