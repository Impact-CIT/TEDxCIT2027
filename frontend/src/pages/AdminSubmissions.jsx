import React, { useState, useEffect } from 'react';

const ANONYMOUS_SECTIONS = [
  {
    title: 'Applicant details',
    fields: [
      ['Full name', 'fullName'],
      ['Student email', 'email'],
      ['Contact number', 'contactNumber'],
      ['Communication email', 'communicationEmail'],
      ['Social profiles', 'socialLinks'],
      ['Institution', 'institution'],
      ['Graduation year', 'graduationYear'],
      ['Department', 'department'],
      ['Section', 'section'],
    ],
  },
  {
    title: 'Talk proposal',
    fields: [
      ['Talk title', 'talkTitle'],
      ['Core message', 'coreMessage'],
      ['Unique perspective', 'uniquePerspective'],
      ['Vision and future impact', 'visionBridge'],
      ['Theme relevance', 'themeRelevance'],
      ['Potential criticism and response', 'criticismResponse'],
      ['Talk structure', 'talkStructure'],
    ],
  },
  {
    title: 'Recording',
    fields: [
      ['Video link', 'recordedSpeechUrl'],
      ['Submission type', 'recordedSpeechType'],
    ],
  },
];

function getSubmissionSections(item, type) {
  if (type === 'anonymous') {
    return ANONYMOUS_SECTIONS;
  }

  const speakerFields = item.isSelfNomination
    ? [
        ['Biography', 'bio'],
        ['Social profiles', 'socialLinks'],
        ['Media links', 'mediaLinks'],
        ['Talk idea', 'uniqueIdea'],
        ['Audience takeaways', 'keyTakeaways'],
      ]
    : [
        ['Nominee name', 'nomineeName'],
        ['Qualification', 'qualification'],
        ['Organization', 'organization'],
        ['Biography', 'bio'],
        ['Social profiles', 'socialLinks'],
        ['Media links', 'mediaLinks'],
        ['Unique perspective', 'uniquePerspective'],
      ];

  return [
    {
      title: 'Nominator details',
      fields: [
        ['Full name', 'fullName', 'nominatorDetails'],
        ['Email', 'email', 'nominatorDetails'],
        ['Communication email', 'communicationEmail', 'nominatorDetails'],
        ['Contact number', 'contactNumber', 'nominatorDetails'],
        ['Work status', 'workStatus', 'nominatorDetails'],
        ['Profession', 'currentProfession', 'nominatorDetails'],
        ['Organization', 'organization', 'nominatorDetails'],
      ],
    },
    {
      title: item.isSelfNomination ? 'Self-nomination profile' : 'Nominee profile',
      fields: speakerFields.map(([label, key]) => [
        label,
        key,
        item.isSelfNomination ? 'selfNomination' : 'nominee',
      ]),
    },
  ];
}

function renderFieldValue(value, label = '') {
  if (value === undefined || value === null || value === '') {
    return <span className="text-[#686873]">Not provided</span>;
  }

  const text = String(value);
  const isLinkField = /link|video/i.test(label);
  const urlPattern = /https?:\/\/[^\s,]+/gi;
  const links = isLinkField ? [...text.matchAll(urlPattern)] : [];
  if (links.length) {
    const parts = [];
    let cursor = 0;
    links.forEach((match, index) => {
      const url = match[0].replace(/[.)]+$/, '');
      const end = match.index + url.length;
      if (match.index > cursor) parts.push(text.slice(cursor, match.index));
      parts.push(
        <a
          key={`${url}-${index}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-[#FF554F] hover:text-white underline underline-offset-4 break-all"
        >
          {url}
        </a>
      );
      cursor = end;
    });
    if (cursor < text.length) parts.push(text.slice(cursor));
    return (
      <span className="whitespace-pre-wrap break-words">
        {parts.map((part, index) => typeof part === 'string' ? <React.Fragment key={index}>{part}</React.Fragment> : part)}
      </span>
    );
  }

  return <span className="whitespace-pre-wrap break-words">{text}</span>;
}

function toLocalDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function toUtcIso(value) {
  return value ? new Date(value).toISOString() : null;
}

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
  const [deadlines, setDeadlines] = useState({ anonymousVoicesDeadline: '', speakerNominationDeadline: '' });
  const [isSavingDeadlines, setIsSavingDeadlines] = useState(false);
  const [deadlineMessage, setDeadlineMessage] = useState(null);
  const [statusError, setStatusError] = useState(null);

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
      setDeadlines({
        anonymousVoicesDeadline: toLocalDateTime(data.deadlines.anonymousVoicesDeadline),
        speakerNominationDeadline: toLocalDateTime(data.deadlines.speakerNominationDeadline),
      });
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

  useEffect(() => {
    if (!selectedItem) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem]);

  const handleLogin = (e) => {
    e.preventDefault();
    fetchSubmissions(password);
  };

  const handleSaveDeadlines = async (e) => {
    e.preventDefault();
    setIsSavingDeadlines(true);
    setDeadlineMessage(null);

    try {
      const res = await fetch('/api/admin/deadlines', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          anonymousVoicesDeadline: toUtcIso(deadlines.anonymousVoicesDeadline),
          speakerNominationDeadline: toUtcIso(deadlines.speakerNominationDeadline),
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to save registration deadlines.');
      }

      setDeadlines({
        anonymousVoicesDeadline: toLocalDateTime(result.data.anonymousVoicesDeadline),
        speakerNominationDeadline: toLocalDateTime(result.data.speakerNominationDeadline),
      });
      setDeadlineMessage('Registration deadlines saved.');
    } catch (err) {
      setDeadlineMessage(err.message || 'Failed to save registration deadlines.');
    } finally {
      setIsSavingDeadlines(false);
    }
  };

  const handleUpdateStatus = async (type, id, newStatus) => {
    setStatusError(null);
    try {
      const res = await fetch(`/api/admin/submissions/${type}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Could not update submission status.');
      }
      setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
      await fetchSubmissions(password);
    } catch (err) {
      setStatusError(err.message || 'Failed to update submission status.');
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
      <div className="w-full min-h-[78vh] bg-[#070707] text-[#F5F5F2] flex items-center justify-center px-4 py-12 font-sans">
        <div className="max-w-md w-full bg-[#101010] border border-white/[0.09] p-7 sm:p-9 shadow-2xl">
          <div className="w-12 h-12 flex items-center justify-center bg-[#E62B1E]/10 border border-[#E62B1E]/20 text-[#FF554F] mb-6">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
              <path d="M8 7h8M8 11h8" />
            </svg>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF554F] mb-2">TEDxCIT 2027 · Curation portal</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Admin sign in</h1>
          <p className="text-sm text-[#85858D] mb-7">Sign in to review applications and manage registration settings.</p>

          {authError && (
            <div role="alert" className="bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-200 mb-4">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A0A0A8] mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-[#080808] border border-white/10 text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-[#E62B1E] hover:bg-[#CF241B] text-white font-semibold text-sm py-3.5 transition-colors cursor-pointer disabled:opacity-50"
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
    <div className="w-full min-h-screen bg-[#070707] text-[#F5F5F2] font-sans py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-8 border-b border-white/10 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-[#E62B1E]/10 border border-[#E62B1E]/25 text-[#FF554F]">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                <path d="M8 7h8M8 11h8" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF554F] mb-2">
                <span>TEDxCIT 2027</span><span className="text-white/25">/</span><span>Curation portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Speaker submissions
              </h1>
              <p className="text-sm text-[#898991] mt-1">Review applications, manage outcomes, and control registration windows.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-semibold tracking-wide px-4 py-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v4h16v-4" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('tedx_admin_token');
                setIsAuthenticated(false);
              }}
              className="inline-flex items-center gap-2 text-xs text-[#9A9AA2] hover:text-white font-semibold px-3 py-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M10 17l5-5-5-5M15 12H3m9-9h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Total submissions', count: counts.total, marker: 'All applications' },
            { label: 'Anonymous Voices', count: counts.anonymousVoices, marker: 'Student applications' },
            { label: 'Speaker nominations', count: counts.speakerNominations, marker: 'Open nominations' },
          ].map((stat, index) => (
            <div key={stat.label} className="bg-[#101010] border border-white/[0.08] px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8E8E96]">{stat.label}</p>
                <p className="text-[11px] text-[#55555D] mt-1">{stat.marker}</p>
              </div>
              <span className={`text-2xl font-semibold tabular-nums ${index === 0 ? 'text-white' : 'text-[#FF554F]'}`}>{stat.count}</span>
            </div>
          ))}
        </div>

        <details className="group bg-[#101010] border border-white/[0.08] mb-8">
          <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <div>
              <h2 className="text-sm font-semibold text-white">Registration deadlines</h2>
              <p className="text-xs text-[#777780] mt-1">Manage when each application form closes.</p>
            </div>
            <span className="flex items-center gap-2 text-xs text-[#A0A0A8] group-open:text-white">
              Manage
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </summary>
          <form onSubmit={handleSaveDeadlines} className="border-t border-white/[0.08] p-5 sm:p-6">
            <p className="text-xs text-[#777780] mb-5">
              Times use your local timezone. Leave Speaker Nomination blank to keep it open without a deadline.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block text-xs font-medium text-[#A0A0A8]">
                Anonymous Voices
                <input
                  type="datetime-local"
                  required
                  value={deadlines.anonymousVoicesDeadline}
                  onChange={(e) => setDeadlines((prev) => ({ ...prev, anonymousVoicesDeadline: e.target.value }))}
                  className="mt-2 w-full bg-[#080808] border border-white/10 text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none"
                />
              </label>
              <label className="block text-xs font-medium text-[#A0A0A8]">
                Speaker Nomination
                <input
                  type="datetime-local"
                  value={deadlines.speakerNominationDeadline}
                  onChange={(e) => setDeadlines((prev) => ({ ...prev, speakerNominationDeadline: e.target.value }))}
                  className="mt-2 w-full bg-[#080808] border border-white/10 text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none"
                />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isSavingDeadlines || !deadlines.anonymousVoicesDeadline}
                className="bg-[#E62B1E] hover:bg-[#CF241B] text-white font-semibold text-xs px-5 py-3 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingDeadlines ? 'Saving...' : 'Save deadlines'}
              </button>
              {deadlineMessage && <span role="status" className="text-xs text-[#A0A0A8]">{deadlineMessage}</span>}
            </div>
          </form>
        </details>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('anonymous')}
            className={`pb-3 px-5 text-sm font-semibold cursor-pointer border-b-2 transition-colors ${
              activeTab === 'anonymous'
                ? 'border-[#E62B1E] text-white'
                : 'border-transparent text-[#8E8E93] hover:text-white'
            }`}
          >
            Anonymous Voices <span className="ml-1.5 text-xs opacity-70">{counts.anonymousVoices}</span>
          </button>
          <button
            onClick={() => setActiveTab('speaker')}
            className={`pb-3 px-5 text-sm font-semibold cursor-pointer border-b-2 transition-colors ${
              activeTab === 'speaker'
                ? 'border-[#E62B1E] text-white'
                : 'border-transparent text-[#8E8E93] hover:text-white'
            }`}
          >
            Speaker Nominations <span className="ml-1.5 text-xs opacity-70">{counts.speakerNominations}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#686871]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchSubmissions(password)}
              placeholder="Search by name, email, or talk title"
              className="w-full bg-[#101010] border border-white/10 text-white pl-10 pr-4 py-3 text-sm focus:border-white/25 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setTimeout(() => fetchSubmissions(password), 50);
              }}
              className="bg-[#101010] border border-white/10 text-white px-4 py-3 text-xs cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => fetchSubmissions(password)}
              className="bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-4 py-3 cursor-pointer transition-colors"
            >
              Apply filters
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 text-xs text-[#777780]">
          <span>{currentList.length} {currentList.length === 1 ? 'result' : 'results'}</span>
          {isLoading && <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF554F] animate-pulse" /> Updating list…</span>}
        </div>

        {/* Submissions Table */}
        <div className="bg-[#0D0D0D] border border-white/[0.08] overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.025] border-b border-white/[0.08] text-[#777780] text-[10px] font-semibold uppercase tracking-[0.12em]">
              <tr>
                <th className="px-5 py-3.5">Applicant / nominator</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Submission</th>
                <th className="px-5 py-3.5">Received</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="mx-auto w-11 h-11 flex items-center justify-center rounded-full bg-white/[0.04] text-[#777780] mb-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#D0D0D4]">No submissions found</p>
                    <p className="text-xs text-[#777780] mt-1">Try changing your search or status filter.</p>
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
                    <tr key={id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.025] transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-semibold text-white block">{name}</span>
                        <span className="text-[#83838C] text-xs mt-1 block">{email}</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#A6A6AE]">{phone}</td>
                      <td className="px-5 py-4 max-w-xs">
                        <span className="block truncate text-[#F0F0F2]">{keyDetail}</span>
                        <span className="block text-[11px] text-[#777780] mt-1">
                          {activeTab === 'anonymous' ? 'Anonymous Voices' : item.isSelfNomination ? 'Self-nomination' : 'Speaker nomination'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#A6A6AE]">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${
                            item.status === 'shortlisted'
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : item.status === 'rejected'
                              ? 'bg-red-500/10 text-red-300'
                              : 'bg-amber-400/10 text-amber-200'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {item.status || 'submitted'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white px-3.5 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          View application <span aria-hidden="true">↗</span>
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
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedItem(null);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="submission-detail-title"
              className="bg-[#0B0B0C] border border-white/10 max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl"
            >
              <header className="sticky top-0 z-10 bg-[#0B0B0C]/95 backdrop-blur border-b border-white/10 px-5 sm:px-8 py-5">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-lg bg-[#E62B1E]/10 border border-[#E62B1E]/20 flex items-center justify-center text-[#FF554F] text-lg font-semibold">
                      {(activeTab === 'anonymous' ? selectedItem.fullName : selectedItem.nominatorDetails?.fullName)?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF554F] mb-1">
                        {activeTab === 'anonymous' ? 'Anonymous Voices application' : 'Speaker nomination'}
                      </p>
                      <h2 id="submission-detail-title" className="text-xl sm:text-2xl font-semibold text-white truncate">
                        {activeTab === 'anonymous' ? selectedItem.fullName : selectedItem.nominatorDetails?.fullName}
                      </h2>
                      <p className="text-xs text-[#85858D] mt-1">
                        Received {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'date unavailable'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Close submission details"
                    onClick={() => setSelectedItem(null)}
                    className="w-9 h-9 shrink-0 rounded border border-white/10 text-[#A0A0A8] hover:text-white hover:bg-white/[0.06] flex items-center justify-center"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              </header>

              <div className="px-5 sm:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-6">
                  <div className="space-y-5">
                    {getSubmissionSections(selectedItem, activeTab).map((section) => (
                      <section key={section.title} className="bg-[#101011] border border-white/[0.07] rounded-lg overflow-hidden">
                        <div className="px-5 py-3 border-b border-white/[0.07]">
                          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#DADAE0]">{section.title}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                          {section.fields.map(([label, key, nested]) => (
                            <div key={key} className="px-5 py-4 border-b border-r border-white/[0.04] last:border-r-0">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#777780] mb-2">{label}</p>
                              <div className="text-sm leading-relaxed text-[#E3E3E7]">
                                {renderFieldValue(nested ? selectedItem[nested]?.[key] : selectedItem[key], label)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>

                  <aside className="space-y-4">
                    <section className="bg-[#101011] border border-white/[0.07] rounded-lg p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777780] mb-3">Application status</p>
                      <div className="flex flex-wrap gap-2">
                        {['submitted', 'shortlisted', 'rejected'].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleUpdateStatus(activeTab, selectedItem._id || selectedItem.id, st)}
                            className={`px-3 py-2 rounded text-xs font-medium capitalize border transition-colors cursor-pointer ${
                              selectedItem.status === st
                                ? 'border-[#E62B1E]/50 bg-[#E62B1E]/15 text-[#FF716A]'
                                : 'border-white/10 bg-white/[0.03] text-[#A0A0A8] hover:text-white hover:bg-white/[0.07]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                      {statusError && <p role="alert" className="text-xs text-red-300 mt-3">{statusError}</p>}
                    </section>

                    <section className="bg-[#101011] border border-white/[0.07] rounded-lg p-5 space-y-4">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777780]">Contact</h3>
                      <div>
                        <p className="text-[10px] text-[#777780] mb-1">Email</p>
                        {(() => {
                          const email = activeTab === 'anonymous' ? selectedItem.email : selectedItem.nominatorDetails?.email;
                          return email
                            ? <a href={`mailto:${email}`} className="text-sm text-[#E3E3E7] hover:text-[#FF716A] break-all">{email}</a>
                            : <span className="text-sm text-[#686873">Not provided</span>;
                        })()}
                      </div>
                      <div>
                        <p className="text-[10px] text-[#777780] mb-1">Phone</p>
                        {(() => {
                          const phone = activeTab === 'anonymous' ? selectedItem.contactNumber : selectedItem.nominatorDetails?.contactNumber;
                          return phone
                            ? <a href={`tel:${phone}`} className="text-sm text-[#E3E3E7] hover:text-[#FF716A]">{phone}</a>
                            : <span className="text-sm text-[#686873">Not provided</span>;
                        })()}
                      </div>
                    </section>

                    <section className="bg-[#101011] border border-white/[0.07] rounded-lg p-5">
                      <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777780] mb-3">Record</h3>
                      <p className="text-[10px] text-[#777780] mb-1">Submission ID</p>
                      <p className="text-[11px] text-[#B5B5BD] font-mono break-all">{selectedItem._id || selectedItem.id}</p>
                    </section>
                  </aside>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
