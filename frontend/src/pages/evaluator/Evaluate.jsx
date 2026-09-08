import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EvaluatorLayout from '../../layouts/EvaluatorLayout';
import { MOCK_APPLICATIONS } from '../../data/mockData';
import BlindEvaluationModal from '../../components/BlindEvaluationModal';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const EvaluatePage = ({ currentUser, onRoleChange }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const application = MOCK_APPLICATIONS.find(a => a.id === id) || MOCK_APPLICATIONS[0];
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  return (
    <EvaluatorLayout currentUser={currentUser} onRoleChange={onRoleChange}>
      <button
        onClick={() => navigate('/evaluator/assigned')}
        className="text-blue-600 font-semibold text-xs flex items-center gap-1.5 mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Assigned Queue
      </button>

      {submittedSuccess ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto space-y-3">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Evaluation Recorded & Signed</h2>
          <p className="text-xs text-slate-500">
            Your independent score has been signed and transmitted to the state innovation committee.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <BlindEvaluationModal
            application={application}
            onClose={() => navigate('/evaluator/assigned')}
          />
        </div>
      )}
    </EvaluatorLayout>
  );
};

export default EvaluatePage;
