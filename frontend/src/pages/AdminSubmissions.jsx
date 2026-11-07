import React, { useState, useEffect } from 'react';

export default function AdminSubmissions() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  const [activeTab, setActiveTab] = useState('anonymous'); // 'anonymous' | 'speaker'
  const [submissions, setSubmissions] = useState({ anonymousVoices: [], speakerNominations: [] });
  const [counts, setCounts] = useState({ anonymousVoices: 0, speakerNominations: 0, total: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchSubmissions = async (adminPwd) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const query = new URLSearchParams({
        status: statusFilter,
        search: searchQuery,
      });

      const res = await fetch(`/api/admin/submissions?${query.toString()}`, {
        headers: {
          'x-admin-password': adminPwd || password,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please verify the admin password.');
      }

      setSubmissions(data.data);
      setCounts(data.counts);
      setIsAuthenticated(true);
      // Cache password in session
      sessionStorage.setItem('tedx_admin_token', adminPwd || password);
    } catch (err) {
      setAuthError(err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cached = sessionStorage.getItem('tedx_admin_token');
    if (cached) {
      setPassword(cached);
      fetchSubmissions(cached);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetchSubmissions(password);
  };

  const handleUpdateStatus = async (type, id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/submissions/${type}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Refresh local
        fetchSubmissions(password);
        if (selectedItem) {
          setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    const url = `/api/admin/submissions?format=csv&status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`;
    fetch(url, {
      headers: {
        'x-admin-password': password,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `tedx-cit-submissions-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => alert('CSV Export failed: ' + err.message));
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[75vh] bg-[#000000] text-[#F5F5F2] flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full bg-[#0E0E0E] border border-[#262626] p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-[0.2em] text-[#E62B1E]">
            <span className="w-2 h-2 rounded-full bg-[#E62B1E]" />
            <span>TEDxCIT 2027 Curation Portal</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white mb-6">
            Admin Access
          </h1>

          {authError && (
            <div className="bg-[#E62B1E]/15 border border-[#E62B1E] p-3 text-xs text-white mb-4">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-[#E62B1E] hover:bg-[#c5231a] text-white font-bold text-xs uppercase tracking-[0.14em] py-3.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Review Submissions'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentList =
    activeTab === 'anonymous' ? submissions.anonymousVoices : submissions.speakerNominations;

  return (
    <div className="w-full min-h-screen bg-[#000000] text-[#F5F5F2] font-sans py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#242424] mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#E62B1E] mb-1">
              <span>MANAGEMENT CONSOLE</span>
              <span>&bull;</span>
              <span>THE UNTAPPED</span>
            </div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
              Curation & Speaker Submissions
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-white text-xs font-mono uppercase tracking-wider px-4 py-2.5 transition-colors cursor-pointer"
            >
              <span>Download CSV Export</span>
              <span>↓</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('tedx_admin_token');
                setIsAuthenticated(false);
              }}
              className="text-xs text-[#8E8E93] hover:text-white uppercase font-mono px-3 py-2 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#242424] mb-6">
          <button
            onClick={() => setActiveTab('anonymous')}
            className={`pb-3 px-6 text-sm font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
              activeTab === 'anonymous'
                ? 'border-[#E62B1E] text-white'
                : 'border-transparent text-[#8E8E93] hover:text-white'
            }`}
          >
            Anonymous Voices ({counts.anonymousVoices})
          </button>
          <button
            onClick={() => setActiveTab('speaker')}
            className={`pb-3 px-6 text-sm font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
              activeTab === 'speaker'
                ? 'border-[#E62B1E] text-white'
                : 'border-transparent text-[#8E8E93] hover:text-white'
            }`}
          >
            Speaker Nominations ({counts.speakerNominations})
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchSubmissions(password)}
              placeholder="Search by name, email, or talk title..."
              className="w-full bg-[#121212] border border-[#262626] text-white px-4 py-2.5 text-xs focus:border-[#E62B1E] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setTimeout(() => fetchSubmissions(password), 50);
              }}
              className="bg-[#121212] border border-[#262626] text-white px-4 py-2.5 text-xs font-mono cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => fetchSubmissions(password)}
              className="bg-[#1E1E1E] hover:bg-[#282828] text-white text-xs font-mono px-4 py-2.5 cursor-pointer uppercase tracking-wider"
            >
              Search
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-[#0C0C0C] border border-[#242424] overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141414] border-b border-[#242424] text-[#A0A0A5] font-mono uppercase tracking-wider">
              <tr>
                <th className="p-4">Applicant / Nominator</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Category / Key Detail</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#6E6E73] font-mono">
                    No submissions found matching criteria.
                  </td>
                </tr>
              ) : (
                currentList.map((item) => {
                  const id = item._id || item.id;
                  const name = activeTab === 'anonymous' ? item.fullName : item.nominatorDetails?.fullName;
                  const email = activeTab === 'anonymous' ? item.email : item.nominatorDetails?.email;
                  const phone = activeTab === 'anonymous' ? item.contactNumber : item.nominatorDetails?.contactNumber;
                  const keyDetail =
                    activeTab === 'anonymous'
                      ? item.talkTitle
                      : item.isSelfNomination
                      ? 'Self-Nomination'
                      : `Nominee: ${item.nominee?.nomineeName || 'N/A'}`;

                  return (
                    <tr key={id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-white block">{name}</span>
                        <span className="text-[#8E8E93] text-[11px]">{email}</span>
                      </td>
                      <td className="p-4 font-mono text-[#A0A0A5]">{phone}</td>
                      <td className="p-4 max-w-xs truncate text-[#F5F5F2]">{keyDetail}</td>
                      <td className="p-4 font-mono text-[#8E8E93]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 font-mono uppercase text-[10px] tracking-wider ${
                            item.status === 'shortlisted'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                              : item.status === 'rejected'
                              ? 'bg-red-950/60 text-red-400 border border-red-900'
                              : 'bg-yellow-950/50 text-yellow-300 border border-yellow-800'
                          }`}
                        >
                          {item.status || 'submitted'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="bg-[#1C1C1E] hover:bg-[#E62B1E] text-white px-3 py-1.5 font-mono uppercase text-[11px] tracking-wider transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-[#0C0C0C] border border-[#2B2B2B] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
              <div className="flex justify-between items-start border-b border-[#242424] pb-4 mb-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#E62B1E] block mb-1">
                    {activeTab === 'anonymous' ? 'Anonymous Voices Candidate' : 'Speaker Nomination Profile'}
                  </span>
                  <h2 className="text-2xl font-bold uppercase text-white">
                    {activeTab === 'anonymous' ? selectedItem.fullName : selectedItem.nominatorDetails?.fullName}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-xl text-[#8E8E93] hover:text-white p-2"
                >
                  ✕
                </button>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 p-3 bg-black/60 border border-[#222] mb-6">
                <span className="text-xs font-mono uppercase text-[#A0A0A5]">Change Status:</span>
                {['submitted', 'shortlisted', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(activeTab, selectedItem._id || selectedItem.id, st)}
                    className={`px-3 py-1 text-xs font-mono uppercase tracking-wider border cursor-pointer ${
                      selectedItem.status === st
                        ? 'border-[#E62B1E] bg-[#E62B1E] text-white'
                        : 'border-[#333] text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Full Fields Display */}
              <div className="space-y-4 text-xs">
                {Object.entries(selectedItem).map(([key, val]) => {
                  if (['_id', '__v', 'updatedAt'].includes(key)) return null;
                  return (
                    <div key={key} className="border-b border-[#1C1C1E] pb-3">
                      <span className="font-mono uppercase text-[#6E6E73] block mb-1">{key}</span>
                      <div className="text-white text-sm whitespace-pre-wrap break-words">
                        {typeof val === 'object' && val !== null ? JSON.stringify(val, null, 2) : String(val)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 mt-6 border-t border-[#242424] text-right">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-[#242424] hover:bg-[#333] text-white text-xs font-mono uppercase tracking-wider px-6 py-2.5 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

