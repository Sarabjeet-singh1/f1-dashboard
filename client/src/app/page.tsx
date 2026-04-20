'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


const API_BASE = 'http://localhost:3001';

interface DriverStanding {
  position: number;
  position_text: string;
  points: string;
  driver: {
    code: string;
    given_name: string;
    family_name: string;
    nationality: string;
  };
  constructor: {
    name: string;
    nationality: string;
  };
}

interface RaceInfo {
  race_name: string;
  location: string;
  date: string;
  winner: string;
}


const TEAMS: Record<string, string> = {
  mercedes: '#27F4D2',
  ferrari: '#E8002D',
  mclaren: '#FF8000',
  redbull: '#3671C6',
  williams: '#64C4FF',
  haas: '#B6BABD',
  alpine: '#0093CC',
  audi: '#00877C',
  racingbulls: '#6692FF',
  aston: '#229971',
  cadillac: '#8A9099',
};

const getTeamKey = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('mercedes')) return 'mercedes';
  if (lower.includes('ferrari')) return 'ferrari';
  if (lower.includes('mclaren')) return 'mclaren';
  if (lower.includes('red bull')) return 'redbull';
  if (lower.includes('williams')) return 'williams';
  if (lower.includes('haas')) return 'haas';
  if (lower.includes('alpine')) return 'alpine';
  if (lower.includes('audi')) return 'audi';
  if (lower.includes('racing bulls') || lower.includes('rb')) return 'racingbulls';
  if (lower.includes('aston')) return 'aston';
  if (lower.includes('cadillac')) return 'cadillac';
  return 'mercedes';
};


const DRIVERS_FALLBACK = [
  { pos: 1, name: 'K. Antonelli', code: 'ANT', team: 'mercedes', pts: 72, gap: null },
  { pos: 2, name: 'G. Russell', code: 'RUS', team: 'mercedes', pts: 63, gap: '-9' },
  { pos: 3, name: 'C. Leclerc', code: 'LEC', team: 'ferrari', pts: 49, gap: '-23' },
  { pos: 4, name: 'L. Hamilton', code: 'HAM', team: 'ferrari', pts: 41, gap: '-31' },
  { pos: 5, name: 'L. Norris', code: 'NOR', team: 'mclaren', pts: 25, gap: '-47' },
  { pos: 6, name: 'O. Piastri', code: 'PIA', team: 'mclaren', pts: 21, gap: '-51' },
  { pos: 7, name: 'O. Bearman', code: 'BEA', team: 'haas', pts: 17, gap: '-55' },
  { pos: 8, name: 'P. Gasly', code: 'GAS', team: 'alpine', pts: 15, gap: '-57' },
  { pos: 9, name: 'M. Verstappen', code: 'VER', team: 'redbull', pts: 12, gap: '-60' },
  { pos: 10, name: 'L. Lawson', code: 'LAW', team: 'racingbulls', pts: 10, gap: '-62' },
];


const CONSTRUCTORS_FALLBACK = [
  { pos: 1, name: 'Mercedes-AMG', engine: 'Mercedes PU', team: 'mercedes', pts: 135 },
  { pos: 2, name: 'Scuderia Ferrari', engine: 'Ferrari PU', team: 'ferrari', pts: 90 },
  { pos: 3, name: 'McLaren', engine: 'Mercedes PU', team: 'mclaren', pts: 46 },
  { pos: 4, name: 'Haas F1', engine: 'Ferrari PU', team: 'haas', pts: 18 },
  { pos: 5, name: 'Red Bull Racing', engine: 'Red Bull Ford', team: 'redbull', pts: 16 },
  { pos: 6, name: 'Alpine', engine: 'Mercedes PU', team: 'alpine', pts: 16 },
  { pos: 7, name: 'Racing Bulls', engine: 'Red Bull Ford', team: 'racingbulls', pts: 14 },
  { pos: 8, name: 'Audi', engine: 'Audi PU', team: 'audi', pts: 2 },
  { pos: 9, name: 'Williams', engine: 'Mercedes PU', team: 'williams', pts: 2 },
  { pos: 10, name: 'Aston Martin', engine: 'Honda PU', team: 'aston', pts: 0 },
  { pos: 11, name: 'Cadillac', engine: 'Ferrari PU', team: 'cadillac', pts: 0 },
];


const CALENDAR = [
  { round: 'R01', flag: '🇦🇳', country: 'Australia', name: 'Albert Park', date: 'Mar 06–08', winner: 'G. Russell', done: true },
  { round: 'R02', flag: '🇨🇳', country: 'China', name: 'Shanghai', date: 'Mar 13–15', winner: 'K. Antonelli', done: true },
  { round: 'R03', flag: '🇯🇵', country: 'Japan', name: 'Suzuka', date: 'Mar 27–29', winner: 'K. Antonelli', done: true },
  { round: 'R04', flag: '🇺🇸', country: 'USA', name: 'Miami', date: 'May 01–03', winner: null, done: false, next: true },
  { round: 'R05', flag: '🇨🇦', country: 'Canada', name: 'Montreal', date: 'May 22–24', winner: null, done: false },
  { round: 'R06', flag: '🇲🇨', country: 'Monaco', name: 'Monte Carlo', date: 'Jun 05–07', winner: null, done: false },
  { round: 'R07', flag: '🇪🇸', country: 'Spain', name: 'Barcelona', date: 'Jun 12–14', winner: null, done: false },
  { round: 'R08', flag: '🇦🇹', country: 'Austria', name: 'Red Bull Ring', date: 'Jun 26–28', winner: null, done: false },
  { round: 'R09', flag: '🇬🇧', country: 'UK', name: 'Silverstone', date: 'Jul 03–05', winner: null, done: false },
  { round: 'R10', flag: '🇧🇪', country: 'Belgium', name: 'Spa', date: 'Jul 24–26', winner: null, done: false },
  { round: 'R11', flag: '🇭🇺', country: 'Hungary', name: 'Hungaroring', date: 'Jul 31–Aug 2', winner: null, done: false },
  { round: 'R12', flag: '🇳🇱', country: 'Netherlands', name: 'Zandvoort', date: 'Aug 21–23', winner: null, done: false },
  { round: 'R13', flag: '🇮🇹', country: 'Italy', name: 'Monza', date: 'Sep 04–06', winner: null, done: false },
  { round: 'R14', flag: '🇪🇸', country: 'Spain', name: 'Madrid', date: 'Sep 11–13', winner: null, done: false },
  { round: 'R15', flag: '🇦🇿', country: 'Azerbaijan', name: 'Baku', date: 'Sep 26 · Sat', winner: null, done: false },
  { round: 'R16', flag: '🇸🇬', country: 'Singapore', name: 'Marina Bay', date: 'Oct 09–11', winner: null, done: false },
  { round: 'R17', flag: '🇺🇸', country: 'USA', name: 'Austin', date: 'Oct 23–25', winner: null, done: false },
  { round: 'R18', flag: '🇲🇽', country: 'Mexico', name: 'Mexico City', date: 'Oct 30–Nov 1', winner: null, done: false },
  { round: 'R19', flag: '🇧🇷', country: 'Brazil', name: 'São Paulo', date: 'Nov 06–08', winner: null, done: false },
  { round: 'R20', flag: '🇺🇸', country: 'USA', name: 'Las Vegas', date: 'Nov 19–21', winner: null, done: false },
  { round: 'R21', flag: '🇶🇦', country: 'Qatar', name: 'Lusail', date: 'Nov 27–29', winner: null, done: false },
  { round: 'R22', flag: '🇦🇪', country: 'UAE', name: 'Yas Marina', date: 'Dec 04–06', winner: null, done: false },
];


const NEWS = [
  { kicker: 'The Story', lead: true, headline: "Antonelli's rookie surge rewrites Mercedes' championship math", body: 'Three rounds in, the 19-year-old Italian has back-to-back wins and sits atop the drivers table. Wolff has already shifted team orders mid-weekend.' },
  { kicker: 'Engine Wars', lead: false, headline: "Red Bull's new PU is down 15hp to Mercedes, paddock sources say", body: "Despite the full Ford works programme, Red Bull's 2026 power unit appears weakest on the grid." },
  { kicker: 'Debut', lead: false, headline: 'Cadillac goal is simple: finish races, learn fast, build for 2029', body: "GM's eleventh team runs Ferrari PUs until its in-house unit is ready." },
  { kicker: 'Calendar', lead: false, headline: 'FIA confirms Bahrain and Saudi cancellations, no replacements', body: 'Iran war fallout leaves the season at 23 rounds, Australia to Abu Dhabi.' },
];


const PODIUM = [
  { pos: 1, name: 'Kimi Antonelli', team: 'Mercedes', time: '1:28:14.802' },
  { pos: 2, name: 'George Russell', team: 'Mercedes', time: '+3.441' },
  { pos: 3, name: 'Charles Leclerc', team: 'Ferrari', time: '+9.127' },
];


const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const maskReveal = {
  hidden: { clipPath: 'inset(100% 0 0 0)', y: 20 },
  visible: { clipPath: 'inset(0 0 0 0)', y: 0, transition: { duration: 1.1, ease: [0.2, 0.9, 0.25, 1] as const } },
};

const underlineDraw = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, ease: [0.3, 0.9, 0.3, 1] as const } },
};

const barGrow = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.4, ease: [0.3, 0.9, 0.3, 1] as const } },
};

const numberCountUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
};


function Ticker() {
  const items = [
    { sym: 'WDC', val: 'ANTONELLI', pts: '72 pts' },
    { sym: 'WCC', val: 'MERCEDES', pts: '135 pts' },
    { sym: 'NEXT', val: 'MIAMI GP', pts: 'MAY 3' },
    { sym: 'WINNER', val: 'ANTONELLI', pts: 'JAPAN' },
    { sym: 'FL', val: 'RUSSELL', pts: '1:28.411' },
    { sym: 'FAST PIT', val: 'MCLAREN', pts: '1.94s' },
    { sym: 'VER', val: '-60', pts: 'P9' },
    { sym: 'ROOKIE', val: 'LINDBLAD', pts: '4 pts' },
  ];

  return (
    <motion.div className="ticker-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="tick">
            <span className="sym">{item.sym}</span>
            <span className="val">{item.val}</span>
            <span className="pts">{item.pts}</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}


function Hero() {
  const [greeting, setGreeting] = useState('');
  const [dateLine, setDateLine] = useState('');

  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    setGreeting(`${g}, Sarabjeet`);
    const D = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    setDateLine(`${D[now.getDay()]} · ${String(now.getDate()).padStart(2, '0')} ${M[now.getMonth()]} · ${now.getFullYear()}`);
  }, []);

  return (
    <section className="hero">
      {[18, 42, 68].map((top, i) => (
        <motion.span
          key={i}
          className="speed-line"
          style={{ top: `${top}%` }}
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 'calc(100vw + 200px)', opacity: [0, 0.5, 0] }}
          transition={{ duration: 5.5, delay: [1.8, 3.2, 2.4][i], repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <motion.div className="hero-top" initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.2 }}>
        <motion.div className="brand-eyebrow" variants={scaleIn} transition={{ delay: 0.5 }}>
          <span className="checker-flag" />
          <span>Personal Edition · F1 2026</span>
        </motion.div>
        <motion.div className="brand-right" variants={fadeInUp} transition={{ delay: 0.7 }}>
          <div className="greeting">{greeting}</div>
          <div className="dateline">{dateLine}</div>
        </motion.div>
      </motion.div>

      <div className="title-wrap">
        <motion.h1 className="hero-title" initial="hidden" animate="visible">
          <motion.span className="line1" variants={maskReveal} transition={{ delay: 0.9 }}>
            <span>Sarabjeet&apos;s</span>
          </motion.span>
          <motion.span className="line2" variants={maskReveal} transition={{ delay: 1.4 }}>
            <span>Pit Wall.</span>
          </motion.span>
        </motion.h1>
        <motion.div className="title-underline" initial="hidden" animate="visible" variants={underlineDraw} transition={{ delay: 2.2 }} />
      </div>

      <motion.div className="hero-sub" initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 2.8 }}>
        <span className="live-badge">Live Edition</span>
        <span>Drivers · Constructors · Paddock · Calendar</span>
      </motion.div>
    </section>
  );
}


function RaceBlock() {
  const [countdown, setCountdown] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const target = new Date('2026-05-03T20:00:00Z').getTime();
    const pad = (n: number) => String(n).padStart(2, '0');

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdown({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      setCountdown({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="race-hero">
      <motion.div className="race-block" initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 3.2 }}>
        <div className="race-grid">
          <div className="race-left">
            <div className="race-meta-row">
              <span className="race-round">◆ Round 04 · Up Next</span>
              <span className="race-flag-big">🇺🇸</span>
            </div>
            <h2 className="race-name">Miami <em>Grand Prix</em></h2>
            <div className="race-circuit">
              <strong>Miami International Autodrome</strong> · Hard Rock Stadium
            </div>
            <div className="race-circuit">Round 4 of 23 · 57 laps · 308.326 km</div>
            <div className="race-stats">
              <div className="race-stat">
                <div className="race-stat-label">Lap Record</div>
                <div className="race-stat-val">1:29.708</div>
              </div>
              <div className="race-stat">
                <div className="race-stat-label">Pole 2025</div>
                <div className="race-stat-val">M. Verstappen</div>
              </div>
              <div className="race-stat">
                <div className="race-stat-label">Dates</div>
                <div className="race-stat-val">May 1 – 3</div>
              </div>
            </div>
          </div>

          <div className="race-right">
            <div className="countdown-label">Lights Out In</div>
            <div className="countdown">
              {(['d', 'h', 'm', 's'] as const).map((key, i) => (
                <motion.div key={key} className="cd-cell" initial="hidden" animate="visible" variants={numberCountUp} transition={{ delay: 3.8 + i * 0.15 }}>
                  <div className="cd-num">{countdown[key]}</div>
                  <div className="cd-label">{key === 'd' ? 'Days' : key === 'h' ? 'Hours' : key === 'm' ? 'Mins' : 'Secs'}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}


function Calendar() {
  return (
    <section className="cal-section">
      <motion.div className="cal-head" initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 3.5 }}>
        <div className="cal-title">Season <em>Calendar</em></div>
        <div className="cal-meta">23 Rounds · Mar → Dec 2026</div>
      </motion.div>

      <div className="cal-strip-wrap">
        <motion.div className="cal-progress-track" initial="hidden" animate="visible" variants={barGrow} transition={{ delay: 4.2 }}>
          <div className="cal-progress-fill" style={{ width: '13.6%' }} />
        </motion.div>
        <div className="cal-strip">
          {CALENDAR.map((race, i) => (
            <motion.div
              key={i}
              className={`cal-round ${race.done ? 'done' : ''} ${race.next ? 'next' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.3 + i * 0.05, duration: 0.4 }}
            >
              <div className="cal-rnum">
                {race.round}
                {race.next && <span className="cal-status-dot" />}
              </div>
              <div className="cal-flag-emoji">{race.flag}</div>
              <div className="cal-country">{race.country}</div>
              <div className="cal-flag-name">{race.name}</div>
              <div className="cal-date">{race.date}</div>
              {race.winner && <div className="cal-winner">{race.winner}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


function DriverRow({ driver, delay }: { driver: typeof DRIVERS_FALLBACK[0]; delay: number }) {
  const teamColor = TEAMS[driver.team];

  return (
    <motion.div
      className={`driver-row ${driver.pos === 1 ? 'leader' : ''}`}
      style={{ '--team-color': teamColor } as React.CSSProperties}
      initial="hidden"
      animate="visible"
      variants={slideInLeft}
      transition={{ delay }}
    >
      <div className="driver-pos">{String(driver.pos).padStart(2, '0')}</div>
      <div className="driver-info">
        <div className="driver-line">
          <span className="driver-name">{driver.name}</span>
          <span className="driver-code" style={{ background: teamColor, color: driver.team === 'mercedes' ? '#000' : '#fff' }}>
            {driver.code}
          </span>
        </div>
        <div className="driver-team">
          {driver.team.charAt(0).toUpperCase() + driver.team.slice(1)} · {driver.gap && <span className="gap">{driver.gap}</span>}
        </div>
      </div>
      <div className="driver-pts-wrap">
        <div className="driver-pts">{driver.pts}</div>
        <div className="driver-pts-sub">pts</div>
      </div>
    </motion.div>
  );
}


function ConstructorRow({ con, delay }: { con: typeof CONSTRUCTORS_FALLBACK[0]; delay: number }) {
  const teamColor = TEAMS[con.team];
  const maxPts = 135;
  const width = (con.pts / maxPts) * 100;

  return (
    <motion.div
      className="con-row"
      style={{ '--team-color': teamColor } as React.CSSProperties}
      initial="hidden"
      animate="visible"
      variants={slideInLeft}
      transition={{ delay }}
    >
      <div className="con-top">
        <div className="con-pos">{String(con.pos).padStart(2, '0')}</div>
        <div>
          <div className="con-name">{con.name}</div>
          <div className="con-engine">{con.engine}</div>
        </div>
        <div className="con-pts">{con.pts}</div>
      </div>
      <div className="con-bar">
        <motion.div className="con-bar-fill" style={{ width: `${width}%` }} initial="hidden" animate="visible" variants={barGrow} transition={{ delay: delay + 1 }} />
      </div>
    </motion.div>
  );
}


function MainGrid({ drivers = DRIVERS_FALLBACK, constructors = CONSTRUCTORS_FALLBACK }: { drivers?: typeof DRIVERS_FALLBACK, constructors?: typeof CONSTRUCTORS_FALLBACK }) {
  return (
    <section className="main-section">
      <div className="main-grid">
        {/* Drivers Championship */}
        <div className="col">
          <motion.div className="col-head" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.5 }}>
            <div className="col-num">§ 01</div>
            <div className="col-name">Drivers&apos; <em>Championship</em></div>
            <div className="col-sub">Top 10 · After 3 Rounds</div>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            {drivers.map((driver, i) => (
              <DriverRow key={driver.pos} driver={driver} delay={4.5 + i * 0.08} />
            ))}
          </motion.div>
        </div>

        {/* Constructors Championship */}
        <div className="col">
          <motion.div className="col-head" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.5 }}>
            <div className="col-num">§ 02</div>
            <div className="col-name">Constructors&apos; <em>Cup</em></div>
            <div className="col-sub">All 11 teams · 2026</div>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            {constructors.map((con, i) => (
              <ConstructorRow key={con.pos} con={con} delay={4.5 + i * 0.08} />
            ))}
          </motion.div>
        </div>

        {/* Paddock Intel */}
        <div className="col">
          <motion.div className="col-head" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4.5 }}>
            <div className="col-num">§ 03</div>
            <div className="col-name">Paddock <em>Intel</em></div>
            <div className="col-sub">Last Race · Top Stories</div>
          </motion.div>

          <div className="podium-block">
            <motion.div className="podium-head" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.6 }}>
              Japanese GP · Suzuka · Result
            </motion.div>
            <motion.div className="podium-list" variants={staggerContainer} initial="hidden" animate="visible">
              {PODIUM.map((p, i) => (
                <motion.div key={p.pos} className={`pod-row p${p.pos}`} variants={slideInLeft} transition={{ delay: 4.6 + i * 0.1 }}>
                  <div className="pod-badge">P{p.pos}</div>
                  <div>
                    <div className="pod-driver-name">{p.name}</div>
                    <div className="pod-driver-team">{p.team}</div>
                  </div>
                  <div className="pod-time">{p.time}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="news-block">
            {NEWS.map((news, i) => (
              <motion.article
                key={i}
                className={`news-item ${news.lead ? 'lead' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 4.7 + i * 0.1 }}
              >
                <div className="news-meta">
                  <span className="news-kicker">{news.kicker}</span>
                  <span className="news-num">0{i + 1}</span>
                </div>
                <h3 className="news-headline">{news.headline}</h3>
                <p className="news-body">{news.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function StatsRibbon({ lastUpdated, loading }: { lastUpdated?: Date | null, loading?: boolean }) {
  const stats = [
    { label: 'Championship Lead', big: '+9 pts', sub: 'Antonelli over Russell' },
    { label: 'Fastest Lap 2026', big: '1:28.411', sub: 'Russell · Japan Q3' },
    { label: 'Fastest Pit Stop', big: '1.94s', sub: 'McLaren · Japanese GP' },
    { label: 'Verstappen Gap', big: 'P9 · −60', sub: 'Worst start since 2017' },
  ];

  return (
    <section className="stats-ribbon">
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div key={i} className="stat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 5 + i * 0.1 }}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-big" dangerouslySetInnerHTML={{ __html: stat.big }} />
            <div className="stat-sub">{stat.sub}</div>
          </motion.div>
        ))}
      </div>
      {lastUpdated && (
        <div className="api-status">
          {loading ? '⟳ Updating...' : `✓ Live · ${lastUpdated.toLocaleTimeString()}`}
        </div>
      )}
    </section>
  );
}

// Footer
function Footer() {
  return (
    <div className="footer-wrap">
      <motion.footer className="footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.5 }}>
        <div className="f-note">
          For Sarabjeet · eyes only<span className="f-dot" />Lights out and away we go
        </div>
        <div className="f-brand">
          The <em>Pit Wall</em>
        </div>
      </motion.footer>
    </div>
  );
}


export default function Home() {
  const [drivers, setDrivers] = useState(DRIVERS_FALLBACK);
  const [constructors, setConstructors] = useState(CONSTRUCTORS_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/standings`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data: DriverStanding[] = await response.json();
        

        const transformedDrivers = data.map((d, idx) => ({
          pos: d.position,
          name: `${d.driver.given_name.charAt(0)}. ${d.driver.family_name}`,
          code: d.driver.code,
          team: getTeamKey(d.constructor.name),
          pts: parseInt(d.points),
          gap: idx === 0 ? null : `-${parseInt(d.points) - parseInt(data[0].points)}`,
        }));
        

        const constructorPoints: Record<string, number> = {};
        data.forEach(d => {
          const team = getTeamKey(d.constructor.name);
          constructorPoints[team] = (constructorPoints[team] || 0) + parseInt(d.points);
        });
        
        const transformedConstructors = Object.entries(constructorPoints)
          .map(([team, pts], idx) => ({
            pos: idx + 1,
            name: data.find(d => getTeamKey(d.constructor.name) === team)?.constructor.name || team,
            engine: 'PU',
            team,
            pts,
          }))
          .sort((a, b) => b.pts - a.pts)
          .map((c, idx) => ({ ...c, pos: idx + 1 }));

        setDrivers(transformedDrivers);
        setConstructors(transformedConstructors);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        console.warn('Using fallback data - API unavailable:', err);
        setError('Using cached data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <Ticker />
      <Hero />
      <RaceBlock />
      <Calendar />
      <MainGrid drivers={drivers} constructors={constructors} />
      <StatsRibbon lastUpdated={lastUpdated} loading={loading} />
      <Footer />
    </main>
  );
}
