import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight, Mail, RotateCcw } from 'lucide-react';
import './Organizers.css';

// Accessible inline brand icons for 100% zero-dependency reliability
const LinkedInIcon = () => (
  <svg
    className="tedx-org-social-icon"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    className="tedx-org-social-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Fallback avatar SVG in case of offline / blocked network image
const FallbackAvatar = ({ name }) => (
  <svg viewBox="0 0 100 120" className="tedx-org-card-photo" fill="#1b1b1b">
    <rect width="100" height="120" fill="#181818" />
    <circle cx="50" cy="46" r="24" fill="#2c2c2c" />
    <path d="M15 110 C20 78, 80 78, 85 110 Z" fill="#2c2c2c" />
    <text x="50" y="52" fill="#E62B32" fontSize="16" fontWeight="bold" textAnchor="middle">
      {name.split(' ').map((n) => n[0]).join('')}
    </text>
  </svg>
);

// Precise 20-card artistic scattered layout coordinates (Reference Image 1 FONDER style)
const collageTargets = [
  { x: 8,  y: 12, rot: -11, scale: 0.95, z: 12 },
  { x: 26, y: 8,  rot: 7,   scale: 1.10, z: 8  },
  { x: 45, y: 11, rot: -7,  scale: 0.90, z: 15 },
  { x: 63, y: 7,  rot: 12,  scale: 1.05, z: 9  },
  { x: 82, y: 12, rot: -8,  scale: 1.00, z: 14 },

  { x: 7,  y: 36, rot: 9,   scale: 1.05, z: 10 },
  { x: 23, y: 32, rot: -14, scale: 0.92, z: 16 },
  { x: 41, y: 34, rot: 5,   scale: 1.15, z: 18 },
  { x: 60, y: 31, rot: -9,  scale: 0.98, z: 13 },
  { x: 79, y: 35, rot: 11,  scale: 1.08, z: 17 },

  { x: 92, y: 28, rot: -6,  scale: 0.88, z: 7  },
  { x: 11, y: 62, rot: -12, scale: 1.05, z: 15 },
  { x: 29, y: 58, rot: 8,   scale: 0.95, z: 11 },
  { x: 48, y: 60, rot: -6,  scale: 1.10, z: 19 },
  { x: 68, y: 56, rot: 13,  scale: 0.94, z: 14 },

  { x: 86, y: 61, rot: -10, scale: 1.12, z: 20 },
  { x: 18, y: 82, rot: 10,  scale: 1.02, z: 16 },
  { x: 38, y: 84, rot: -8,  scale: 0.96, z: 12 },
  { x: 58, y: 81, rot: 7,   scale: 1.08, z: 18 },
  { x: 78, y: 83, rot: -12, scale: 0.95, z: 13 },
];

// Organizers Dataset: EXACTLY 20 organizers with real photos and designations
const organizersData = [
  {
    id: 1,
    name: 'Karthik Subramanian',
    role: 'Lead Organizer & Licensee',
    department: 'Executive Committee',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    description: 'Guiding visionary direction and steering the core TEDxCIT 2027 mission.',
    extendedBio: 'Coordinates institutional licensing, partner governance, and executive strategy for TEDxCIT 2027.',
    focusTags: ['Governance', 'Strategy', 'TED License'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 2,
    name: 'Pooja Sundaram',
    role: 'Co-Organizer & Operations Lead',
    department: 'Operations',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    description: 'Directing venue operations, attendee flow, and synchronized timelines.',
    extendedBio: 'Manages seamless venue orchestration, stage schedules, and cross-team execution.',
    focusTags: ['Operations', 'Timelines', 'Event Flow'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 3,
    name: 'Arun Kumar',
    role: 'Head of Curation',
    department: 'Curation',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    description: 'Scouting extraordinary thinkers and unearthing ideas worth spreading.',
    extendedBio: 'Leads the speaker curation team, discovering transformative stories and thought leaders.',
    focusTags: ['Speaker Scouting', 'Ideas', 'Narratives'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 4,
    name: 'Meera Krishnan',
    role: 'Speaker Coach & Editorial Lead',
    department: 'Curation',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    description: 'Empowering keynote speakers through narrative structure and coaching.',
    extendedBio: 'Conducts rigorous script workshops and stage delivery coaching for every talk.',
    focusTags: ['Storytelling', 'Vocal Coaching', 'Scripts'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 5,
    name: 'Sanjay Natarajan',
    role: 'Director of Production',
    department: 'Production',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    description: 'Crafting immersive multi-sensory auditorium environments and stage design.',
    extendedBio: 'Oversees stage architecture, heavy rigging, LED screen matrixes, and live technical delivery.',
    focusTags: ['Stage Rigging', 'Production', 'AV Matrix'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 6,
    name: 'Divya Ramesh',
    role: 'Technical Architecture Lead',
    department: 'Technology',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    description: 'Architecting web applications, ticketing infrastructure, and livestream pipelines.',
    extendedBio: 'Builds interactive web platforms, accreditation portals, and real-time delegate sync.',
    focusTags: ['Web Platforms', 'Cloud Systems', 'Full Stack'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 7,
    name: 'Rahul Varma',
    role: 'Creative Director & Brand Lead',
    department: 'Design',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    description: 'Designing visual identity, typography systems, and promotional motion design.',
    extendedBio: 'Curates TEDxCIT brand aesthetics, stage motion graphics, and print publications.',
    focusTags: ['Brand Identity', 'Motion Graphics', 'Typography'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 8,
    name: 'Swathi Venkatesh',
    role: 'Stage & Experience Designer',
    department: 'Stagecraft',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    description: 'Engineering spatial aesthetics and physical attendee journey touchpoints.',
    extendedBio: 'Creates custom acoustic backdrop sculptures and ambient entrance installations.',
    focusTags: ['Spatial Design', 'Scenic Arts', 'Lighting'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 9,
    name: 'Naveen Raj',
    role: 'Head of Sponsorships & Alliances',
    department: 'Partnerships',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    description: 'Fostering partnerships with technology pioneers and patron institutions.',
    extendedBio: 'Connects visionary organizations and community supporters with TEDxCIT.',
    focusTags: ['Partnerships', 'Alliances', 'Sponsorship'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 10,
    name: 'Ananya Sen',
    role: 'Delegate Experience Lead',
    department: 'Experience',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    description: 'Curating thought-exchange lounges, interactive walls, and networking breaks.',
    extendedBio: 'Designs delegate engagement stations, networking activities, and conference hospitality.',
    focusTags: ['Networking', 'Hospitality', 'Interactive'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 11,
    name: 'Rohan Pillai',
    role: 'Cinematography & Broadcast Lead',
    department: 'Broadcast',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    description: 'Directing 4K multi-camera streaming and cinema-grade keynote recordings.',
    extendedBio: 'Supervises broadcast cameras, optical zoom tracking, and live color grading.',
    focusTags: ['4K Multi-Cam', 'Live Broadcast', 'Directing'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 12,
    name: 'Sneha Harish',
    role: 'Audio & Acoustics Engineer',
    department: 'Audio',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    description: 'Calibrating line-array acoustics for crystalline speech fidelity.',
    extendedBio: 'Tunes auditorium acoustic response, wireless microphone channels, and live mastering.',
    focusTags: ['Acoustics', 'Line Array', 'Sound Engineering'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 13,
    name: 'Vikramaditya Rao',
    role: 'Lighting & Stagecraft Specialist',
    department: 'Production',
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80',
    description: 'Programming intelligent DMX spotlight cues and thematic color washes.',
    extendedBio: 'Designs dynamic lighting scenes mapped to each speaker’s keynote energy.',
    focusTags: ['DMX Cues', 'Illumination', 'Atmosphere'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 14,
    name: 'Harini Balaji',
    role: 'Volunteer Mobilization Lead',
    department: 'Volunteer Corps',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    description: 'Mobilizing and guiding student volunteers across conference sectors.',
    extendedBio: 'Conducts volunteer bootcamps, radio coordination, and zone dispatching.',
    focusTags: ['Leadership', 'Mobilization', 'Teamwork'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 15,
    name: 'Gautam Iyer',
    role: 'Safety & Logistics Coordinator',
    department: 'Safety & Protocol',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    description: 'Ensuring venue safety protocol, crowd flow, and emergency readiness.',
    extendedBio: 'Coordinates emergency response, access corridors, and safety auditing.',
    focusTags: ['Crowd Protocol', 'Safety', 'Logistics'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 16,
    name: 'Nithya Sridhar',
    role: 'Digital Marketing & PR Lead',
    department: 'Marketing',
    photo: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=600&q=80',
    description: 'Amplifying speaker announcements and driving online community reach.',
    extendedBio: 'Executes digital campaigns, press relations, and keynote teasers.',
    focusTags: ['Campaigns', 'PR', 'Digital Reach'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 17,
    name: 'Deepak Chandran',
    role: 'Front of House & Accreditation Lead',
    department: 'Registration',
    photo: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=600&q=80',
    description: 'Supervising high-speed QR check-ins and VIP attendee accreditation.',
    extendedBio: 'Manages registration kiosks, badge issuance, and welcome reception.',
    focusTags: ['Accreditation', 'QR Check-in', 'Hospitality'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 18,
    name: 'Pavithra Mohan',
    role: 'Interactive Installations Lead',
    department: 'Experience',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',
    description: 'Building interactive art installations for delegate self-reflection.',
    extendedBio: 'Curates generative digital exhibits and community idea contribution boards.',
    focusTags: ['Interactive Art', 'Exhibits', 'Community'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 19,
    name: 'Vishal Nair',
    role: 'Documentation & Media Lead',
    department: 'Media',
    photo: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=600&q=80',
    description: 'Capturing candid behind-the-scenes portraits and publishing daily journals.',
    extendedBio: 'Directs still photography, keynote archival, and event retrospective media.',
    focusTags: ['Photography', 'Documentary', 'Archival'],
    linkedinUrl: 'https://www.linkedin.com',
  },
  {
    id: 20,
    name: 'Kavya Menon',
    role: 'Executive Committee Secretary',
    department: 'Executive Committee',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    description: 'Synchronizing cross-department milestone reviews and TED compliance.',
    extendedBio: 'Coordinates steering committees, administrative archives, and milestone verification.',
    focusTags: ['Governance', 'Milestones', 'Compliance'],
    linkedinUrl: 'https://www.linkedin.com',
  },
];

export default function Organizers() {
  const [isCollage, setIsCollage] = useState(true);
  const [activeCardId, setActiveCardId] = useState(null);
  const [imgErrorMap, setImgErrorMap] = useState({});

  // Single source of card DOM element references
  const cardRefs = useRef({});

  // Apply collage transformation to the 20 cards
  const applyCollageLayout = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    organizersData.forEach((org, i) => {
      const el = cardRefs.current[org.id];
      if (!el) return;

      const target = collageTargets[i];
      const targetPxX = (target.x / 100) * vw;
      const targetPxY = (target.y / 100) * vh;

      const rect = el.getBoundingClientRect();
      const deltaX = targetPxX - (rect.left + rect.width / 2);
      const deltaY = targetPxY - (rect.top + rect.height / 2);

      el.style.transformOrigin = 'center center';
      el.style.transition = 'none';
      el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) rotate(${target.rot}deg) scale(${target.scale})`;
      el.style.zIndex = `${target.z}`;
    });
  }, []);

  // Assemble grid: transition the SAME cards into the 5x4 grid
  const assembleGrid = useCallback(() => {
    setIsCollage(false);

    organizersData.forEach((org) => {
      const el = cardRefs.current[org.id];
      if (!el) return;

      el.style.transition = 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1.4s ease, border-color 1.4s ease';
      el.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
      el.style.zIndex = '1';
    });

    // Clean up inline styles after transition completes
    const timer = setTimeout(() => {
      organizersData.forEach((org) => {
        const el = cardRefs.current[org.id];
        if (!el) return;
        el.style.transform = '';
        el.style.transition = '';
        el.style.transformOrigin = '';
        el.style.zIndex = '';
      });
    }, 1750);

    return () => clearTimeout(timer);
  }, []);

  // Replay animation: scatter back to collage, then assemble after 2s
  const handleReplay = () => {
    setActiveCardId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsCollage(true);

    requestAnimationFrame(() => {
      applyCollageLayout();
      setTimeout(() => {
        assembleGrid();
      }, 2000);
    });
  };

  // Mount effect: scatter cards into collage, then auto-assemble after 2s
  useEffect(() => {
    // Initial scatter
    applyCollageLayout();

    const assembleTimer = setTimeout(() => {
      assembleGrid();
    }, 2000);

    return () => clearTimeout(assembleTimer);
  }, [applyCollageLayout, assembleGrid]);

  const handleCardToggle = (id) => {
    setActiveCardId((prev) => (prev === id ? null : id));
  };

  const handleImageError = (id) => {
    setImgErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <main className={`tedx-org-page ${isCollage ? 'is-in-collage-mode' : ''}`}>
      {/* Background Ambient Lighting & Subtle Grid */}
      <div className="tedx-org-ambient-bg" aria-hidden="true">
        <div className="tedx-org-glow-orb-top" />
        <div className="tedx-org-glow-orb-mid" />
        <div className="tedx-org-grid-overlay" />
      </div>

      {/* Floating HUD shown only during the 2-second collage state */}
      <div
        className="tedx-org-collage-hud"
        style={{
          opacity: isCollage ? 1 : 0,
          pointerEvents: isCollage ? 'auto' : 'none',
          transition: 'opacity 0.6s ease',
        }}
      >
        <div className="tedx-org-collage-badge">
          <span className="tedx-org-pulse-dot" aria-hidden="true" />
          <span>TEDxCIT 2027 • The Organizing Team</span>
        </div>
        <button
          type="button"
          className="tedx-org-collage-skip-btn"
          onClick={assembleGrid}
        >
          Assembling into grid in 2s (or click to assemble)
        </button>
      </div>

      {/* ====================================================================
          B. TWO ROLLING ORGANISER ROWS (CONTINUOUS MARQUEE)
          Row 1: Left to Right | Row 2: Right to Left
          ==================================================================== */}
      <section
        className="tedx-org-rolling-section"
        aria-label="Rolling Organiser Showcase"
        style={{
          opacity: isCollage ? 0 : 1,
          transform: isCollage ? 'translateY(-30px)' : 'translateY(0)',
          pointerEvents: isCollage ? 'none' : 'auto',
          transition: 'opacity 1.2s ease 0.3s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
        }}
      >
        {/* Row 1: Left to Right */}
        <div className="tedx-org-rolling-viewport" tabIndex={0} aria-label="Organiser Highlights Track 1">
          <div className="tedx-org-rolling-track tedx-org-rolling-track-l2r">
            {[...organizersData.slice(0, 10), ...organizersData.slice(0, 10)].map((org, index) => (
              <div key={`roll-r1-${org.id}-${index}`} className="tedx-org-mini-card">
                <img
                  src={org.photo}
                  alt={org.name}
                  className="tedx-org-mini-card-avatar"
                  onError={() => handleImageError(org.id)}
                />
                <div className="tedx-org-mini-card-info">
                  <span className="tedx-org-mini-card-name">{org.name}</span>
                  <span className="tedx-org-mini-card-role">{org.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right to Left */}
        <div
          className="tedx-org-rolling-viewport"
          tabIndex={0}
          aria-label="Organiser Highlights Track 2"
          style={{ marginTop: '0.75rem' }}
        >
          <div className="tedx-org-rolling-track tedx-org-rolling-track-r2l">
            {[...organizersData.slice(10, 20), ...organizersData.slice(10, 20)].map((org, index) => (
              <div key={`roll-r2-${org.id}-${index}`} className="tedx-org-mini-card">
                <img
                  src={org.photo}
                  alt={org.name}
                  className="tedx-org-mini-card-avatar"
                  onError={() => handleImageError(org.id)}
                />
                <div className="tedx-org-mini-card-info">
                  <span className="tedx-org-mini-card-name">{org.name}</span>
                  <span className="tedx-org-mini-card-role">{org.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          C. MAIN HEADING
          ==================================================================== */}
      <section
        className="tedx-org-heading-section"
        aria-labelledby="main-organisers-heading"
        style={{
          opacity: isCollage ? 0 : 1,
          transform: isCollage ? 'translateY(-20px)' : 'translateY(0)',
          pointerEvents: isCollage ? 'none' : 'auto',
          transition: 'opacity 1.2s ease 0.4s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
        }}
      >
        <div className="tedx-org-container">
          <h1 id="main-organisers-heading" className="tedx-org-main-heading">
            MEET OUR <br />
            <span className="tedx-org-red-highlight">ORGANISERS</span>
          </h1>
          <p className="tedx-org-main-subtitle">
            The minds behind the movement.
          </p>
          <div className="tedx-org-main-divider" aria-hidden="true" />
        </div>
      </section>

      {/* ====================================================================
          D. ORGANISER PROFILE GRID (EXACTLY 20 CARDS: 5 COLS x 4 ROWS ON DESKTOP)
          The SAME card elements seamlessly animate from collage into this grid
          ==================================================================== */}
      <div className="tedx-org-container">
        <section className="tedx-org-grid-section" aria-label="Organiser Directory">
          <div className="tedx-org-grid">
            {organizersData.map((organizer) => {
              const isActive = activeCardId === organizer.id;
              const hasError = imgErrorMap[organizer.id];

              return (
                <article
                  key={organizer.id}
                  ref={(el) => {
                    cardRefs.current[organizer.id] = el;
                  }}
                  className={`tedx-org-card ${isActive ? 'is-active' : ''}`}
                  tabIndex={0}
                  onClick={() => handleCardToggle(organizer.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardToggle(organizer.id);
                    }
                  }}
                  aria-expanded={isActive}
                >
                  <div className="tedx-org-card-glow-mesh" aria-hidden="true" />

                  {/* Card Portrait Photo Area */}
                  <div className="tedx-org-card-photo-wrapper">
                    <span className="tedx-org-card-dept-tag">
                      {organizer.department}
                    </span>
                    {!hasError ? (
                      <img
                        src={organizer.photo}
                        alt={organizer.name}
                        className="tedx-org-card-photo"
                        onError={() => handleImageError(organizer.id)}
                        loading="eager"
                      />
                    ) : (
                      <FallbackAvatar name={organizer.name} />
                    )}
                    <div className="tedx-org-card-photo-overlay" aria-hidden="true" />
                  </div>

                  {/* Card Content Body */}
                  <div className="tedx-org-card-body">
                    <h3 className="tedx-org-card-name">{organizer.name}</h3>
                    <p className="tedx-org-card-role">{organizer.role}</p>
                    <p className="tedx-org-card-description">
                      "{organizer.description}"
                    </p>

                    {/* Smooth Revealable Details */}
                    <div className="tedx-org-card-details">
                      <div className="tedx-org-card-bio">
                        {organizer.extendedBio}
                      </div>
                      <div className="tedx-org-card-tags">
                        {organizer.focusTags.map((tag) => (
                          <span key={tag} className="tedx-org-focus-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions (LinkedIn & Contacts) */}
                    <div className="tedx-org-card-actions">
                      <a
                        href={organizer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tedx-org-linkedin-btn"
                        title={`Connect with ${organizer.name} on LinkedIn`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LinkedInIcon />
                        <span>LinkedIn</span>
                        <ArrowUpRight className="tedx-org-arrow-icon" aria-hidden="true" />
                      </a>

                      <a
                        href="mailto:organizers@tedxcit.com"
                        className="tedx-org-icon-link"
                        title="Send Email"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="tedx-org-social-icon" aria-hidden="true" />
                      </a>

                      <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tedx-org-icon-link"
                        title="Instagram"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <InstagramIcon />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Floating Replay Animation Button */}
      {!isCollage && (
        <button
          type="button"
          className="tedx-org-replay-fab"
          onClick={handleReplay}
          title="Replay cinematic collage-to-grid animation"
        >
          <RotateCcw style={{ width: '14px', height: '14px' }} />
          <span>Replay Intro</span>
        </button>
      )}
    </main>
  );
}
