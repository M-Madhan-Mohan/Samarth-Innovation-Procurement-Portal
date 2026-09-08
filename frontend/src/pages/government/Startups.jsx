import React, { useState, useEffect } from 'react';
import GovernmentLayout from '../../layouts/GovernmentLayout';
import { MOCK_STARTUPS, DOMAIN_CATEGORIES } from '../../data/mockData';
import GovernmentStartupCard from '../../components/government/StartupCard';
import SearchBar from '../../components/common/SearchBar';
import MatchingBreakdown from '../../components/MatchingBreakdown';
import StartupPassportModal from '../../components/StartupPassportModal';
import { Sparkles, Award, ShieldCheck, Building2, Search, SlidersHorizontal } from 'lucide-react';
import { api } from '../../services/api';

const GovernmentStartups = ({ currentUser, onRoleChange }) => {
  const [activeTab, setActiveTab] = useState('matching'); // 'matching' or 'directory'
  const [challenges, setChallenges] = useState([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState('CH-2026-PUNE-01');
  const [matchData, setMatchData] = useState(null);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Passport Modal State
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [passportModalOpen, setPassportModalOpen] = useState(false);

  // Search/Filter for Directory Tab
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function loadChallenges() {
      const list = await api.getChallenges();
      if (list && list.length > 0) {
        setChallenges(list);
        setSelectedChallengeId(list[0].id);
      }
    }
    loadChallenges();
  }, []);

  useEffect(() => {
    if (activeTab === 'matching' && selectedChallengeId) {
      runMatching(selectedChallengeId);
    }
  }, [activeTab, selectedChallengeId]);

  const runMatching = async (chId) => {
    setLoadingMatches(true);
    const data = await api.getMatchingStartups(chId);
    setMatchData(data);
    setLoadingMatches(false);
  };

  const handleOpenPassport = async (startupId) => {
    const p = await api.getStartupPassport(startupId);
    setSelectedPassport(p);
    setPassportModalOpen(true);
  };

  const filteredStartups = MOCK_STARTUPS.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.dpiitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'all' || st.domain === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <GovernmentLayout currentUser={currentUser} onRoleChange={onRoleChange}>
      <div className="space-y-6">
        {/* Header & Tab Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              AI Startup Discovery & Capability Matching
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Match government challenges with DPIIT-recognized startups using 7-dimension explainable scoring
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('matching')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'matching'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Matching Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'directory'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>DPIIT Directory ({MOCK_STARTUPS.length})</span>
            </button>
          </div>
        </div>

        {/* AI MATCHING TAB */}
        {activeTab === 'matching' && (
          <div className="space-y-6">
            {/* Select Challenge Bar */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Target Government Challenge</span>
                <span className="text-xs text-slate-400">Select challenge to run 7-dimension capabilities match</span>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={selectedChallengeId}
                  onChange={(e) => setSelectedChallengeId(e.target.value)}
                  className="bg-slate-950 text-xs text-white border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 flex-1 md:w-80"
                >
                  {challenges.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>

                <button
                  onClick={() => runMatching(selectedChallengeId)}
                  disabled={loadingMatches}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loadingMatches ? 'Matching...' : 'RUN MATCHING'}</span>
                </button>
              </div>
            </div>

            {/* Match Results */}
            {loadingMatches ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">Running 7-Dimension Capability Matcher across DPIIT Startup Registry...</p>
              </div>
            ) : matchData && matchData.matches ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Evaluated <strong>{matchData.total_startups_evaluated || matchData.matches.length}</strong> eligible startups for <strong>{matchData.challenge_title || selectedChallengeId}</strong></span>
                  <span className="font-bold text-emerald-600">Highest Score: {matchData.matches[0]?.overall_score}%</span>
                </div>

                {matchData.matches.map((m) => (
                  <div key={m.startup_id} className="space-y-3">
                    <MatchingBreakdown match={m} />
                    <div className="flex justify-end gap-2 text-xs px-2">
                      <button
                        onClick={() => handleOpenPassport(m.startup_id)}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Startup Passport</span>
                      </button>
                      <button
                        onClick={() => alert(`Startup ${m.name} shortlisted for pilot award!`)}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow transition"
                      >
                        Shortlist for Pilot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                No match results found. Please select a challenge above.
              </div>
            )}
          </div>
        )}

        {/* DIRECTORY TAB */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={DOMAIN_CATEGORIES}
              placeholder="Search by startup name, DPIIT number, city, or tech focus..."
            />

            <div className="cards-grid">
              {filteredStartups.map((st) => (
                <GovernmentStartupCard
                  key={st.id}
                  startup={st}
                  onSelectForPilot={(s) => handleOpenPassport(s.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Passport Modal */}
      {passportModalOpen && (
        <StartupPassportModal
          passport={selectedPassport}
          onClose={() => setPassportModalOpen(false)}
        />
      )}
    </GovernmentLayout>
  );
};

export default GovernmentStartups;
