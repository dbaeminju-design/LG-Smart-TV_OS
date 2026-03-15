// MainSettingsLayout – LG webOS 전체 설정 레이아웃
// ┌──────────────────────────────────────────────────────────────┐
// │  Left Nav (240px)    │  Right Content Panel (flex 1)         │
// │  [●] 네트워크        │  ← 선택된 메뉴 내용                  │
// │  [●] 화면/소리       │                                        │
// │  [●] 가족 보호  ●   │                                        │
// │  [●] 시스템          │                                        │
// └──────────────────────────────────────────────────────────────┘
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { ChildProfile } from '../data/profiles'
import { getThemeByAge } from '../data/profiles'
import { ProfileSettingsDetail } from './ProfileSettingsDetail'

// ─── 타입 ─────────────────────────────────────────────────────────────────────
type NavId = 'network' | 'display' | 'family' | 'system' | 'smartcam'

interface NavItem {
  id: NavId
  label: string
  sub: string
  icon: React.ReactNode
}

interface Props {
  onBack: () => void
  profiles: ChildProfile[]
  activeProfileId: string
  onUpdateTimeLimit: (id: string, mins: number) => void
  initialSection?: NavId
}

// ─── 아이콘 (20×20 고정) ──────────────────────────────────────────────────────
const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
    width={20} height={20} style={{ flexShrink: 0 }}>
    {children}
  </svg>
)

const NAV_ITEMS: NavItem[] = [
  {
    id: 'network',
    label: '네트워크',
    sub: 'Wi-Fi 및 유선 연결',
    icon: (
      <Icon>
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx={12} cy={20} r={1} fill="currentColor" />
      </Icon>
    ),
  },
  {
    id: 'display',
    label: '화면/소리',
    sub: '디스플레이 및 오디오 출력',
    icon: (
      <Icon>
        <rect x={2} y={3} width={20} height={14} rx={2} />
        <path d="M8 21h8M12 17v4" />
      </Icon>
    ),
  },
  {
    id: 'family',
    label: '가족 보호',
    sub: '키즈 시청 관리',
    icon: (
      <Icon>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx={9} cy={7} r={4} />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </Icon>
    ),
  },
  {
    id: 'system',
    label: '시스템',
    sub: '업데이트, 시간, 언어',
    icon: (
      <Icon>
        <circle cx={12} cy={12} r={3} />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </Icon>
    ),
  },
  {
    id: 'smartcam',
    label: '스마트캠 케어',
    sub: 'AI 자세·원격 모니터링',
    icon: (
      <Icon>
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
      </Icon>
    ),
  },
]

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export function MainSettingsLayout({
  onBack,
  profiles,
  activeProfileId,
  onUpdateTimeLimit,
  initialSection = 'network',
}: Props) {
  const [activeNav, setActiveNav] = useState<NavId>(initialSection)
  const [familyDetailId, setFamilyDetailId] = useState<string | null>(null)
  const [jointViewOpen, setJointViewOpen] = useState(false)
  const navRefs = useRef<(HTMLButtonElement | null)[]>([])

  // 키보드로 좌측 내비 이동 (리모컨 up/down)
  const handleNavKey = useCallback((e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (idx + 1) % NAV_ITEMS.length
      navRefs.current[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (idx - 1 + NAV_ITEMS.length) % NAV_ITEMS.length
      navRefs.current[prev]?.focus()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      // 패널 첫 포커스 가능 요소로 이동
      const panel = document.querySelector<HTMLElement>('.msl-panel [tabindex="0"], .msl-panel button, .msl-panel input')
      panel?.focus()
    }
  }, [])

  const slideVariants = {
    enterRight: { x: 40, opacity: 0 },
    enterLeft:  { x: -40, opacity: 0 },
    center:     { x: 0, opacity: 1, transition: { type: 'spring' as const, damping: 22, stiffness: 260 } },
    exit:       { x: -20, opacity: 0, transition: { duration: 0.16 } },
  }

  return (
    <div className="msl-root">

      {/* ── 좌측 내비게이션 ── */}
      <nav className="msl-nav" aria-label="설정 메뉴">
        <div className="msl-nav-title">설정</div>

        {NAV_ITEMS.map((item, idx) => {
          const isActive = activeNav === item.id
          const hasBadge = item.id === 'family' && profiles.length > 0
          return (
            <button
              key={item.id}
              ref={el => { navRefs.current[idx] = el }}
              type="button"
              className={`msl-nav-item${isActive ? ' msl-nav-item--active' : ''}`}
              onClick={() => { setActiveNav(item.id); setFamilyDetailId(null); setJointViewOpen(false) }}
              onKeyDown={e => handleNavKey(e, idx)}
              aria-selected={isActive}
              tabIndex={0}
            >
              <span className={`msl-nav-icon-wrap${isActive ? ' msl-nav-icon-wrap--active' : ''}`}>
                {item.icon}
              </span>
              <span className="msl-nav-text">
                <span className="msl-nav-label">{item.label}</span>
                <span className="msl-nav-sub">{item.sub}</span>
              </span>
              {hasBadge && (
                <span className="msl-nav-badge">{profiles.length}</span>
              )}
              {isActive && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  strokeLinecap="round" width={14} height={14} style={{ marginLeft: 'auto', opacity: .6 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          )
        })}

        {/* 닫기 */}
        <button
          type="button"
          className="msl-close-btn"
          onClick={onBack}
          tabIndex={0}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
            strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
            <line x1={18} y1={6} x2={6} y2={18} />
            <line x1={6} y1={6} x2={18} y2={18} />
          </svg>
          닫기
        </button>
      </nav>

      {/* ── 우측 콘텐츠 패널 ── */}
      <div className="msl-panel">
        <AnimatePresence mode="wait">
          {/* 가족 보호 → 자녀 상세 */}
          {activeNav === 'family' && familyDetailId ? (
            <motion.div key={`fam-detail-${familyDetailId}`}
              className="msl-panel-inner"
              initial="enterRight" animate="center" exit="exit"
              variants={slideVariants}
              style={{ height: '100%' }}
            >
              <ProfileSettingsDetail
                profile={profiles.find(p => p.id === familyDetailId) ?? profiles[0]}
                onUpdateTimeLimit={onUpdateTimeLimit}
                onSave={() => setFamilyDetailId(null)}
                onCancel={() => setFamilyDetailId(null)}
              />
            </motion.div>
          ) : activeNav === 'family' && jointViewOpen ? (
            /* 가족 보호 → 공동 시청 모드 상세 */
            <motion.div key="joint-view"
              className="msl-panel-inner"
              initial="enterRight" animate="center" exit="exit"
              variants={slideVariants}
              style={{ height: '100%' }}
            >
              <JointViewPanel
                profiles={profiles}
                onBack={() => setJointViewOpen(false)}
              />
            </motion.div>
          ) : (
            <motion.div key={activeNav}
              className="msl-panel-inner"
              initial="enterRight" animate="center" exit="exit"
              variants={slideVariants}
            >
              {activeNav === 'network'   && <NetworkPanel />}
              {activeNav === 'display'   && <DisplayPanel />}
              {activeNav === 'family'    && (
                <FamilyPanel
                  profiles={profiles}
                  onOpenDetail={id => setFamilyDetailId(id)}
                  onOpenJointView={() => setJointViewOpen(true)}
                />
              )}
              {activeNav === 'system'    && <SystemPanel />}
              {activeNav === 'smartcam'  && <SmartCamPanel />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   공용 TV 컨트롤 컴포넌트
   ════════════════════════════════════════════════════════════════════════════ */

// LG OS 스타일 토글 스위치 (리모컨 Enter/Space 지원)
function TVToggle({
  value, onChange, accent = '#7C4DFF',
}: { value: boolean; onChange: (v: boolean) => void; accent?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      className={`tv-toggle${value ? ' tv-toggle--on' : ''}`}
      style={value ? { background: accent } : {}}
      onClick={() => onChange(!value)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!value) }
      }}
      tabIndex={0}
    >
      <span className="tv-toggle-knob" />
    </button>
  )
}

// LG OS 슬라이더 (리모컨 좌우 방향키 지원)
function TVSlider({
  value, min, max, step, onChange, accent = '#7C4DFF', label,
}: {
  value: number; min: number; max: number; step: number
  onChange: (v: number) => void; accent?: string; label?: string
}) {
  return (
    <div className="tv-slider-wrap">
      {label && <span className="tv-slider-label">{label}</span>}
      <div className="tv-slider-row">
        <span className="tv-slider-min">{min}</span>
        <input
          type="range"
          className="psd-slider"
          min={min} max={max} step={step}
          value={value}
          style={{ '--psd-accent': accent } as React.CSSProperties}
          onKeyDown={e => {
            if (e.key === 'ArrowLeft')  { e.preventDefault(); onChange(Math.max(min, value - step)) }
            if (e.key === 'ArrowRight') { e.preventDefault(); onChange(Math.min(max, value + step)) }
          }}
          onChange={e => onChange(Number(e.target.value))}
          tabIndex={0}
        />
        <span className="tv-slider-max">{max}</span>
        <span className="tv-slider-val" style={{ color: accent }}>{value}</span>
      </div>
    </div>
  )
}

// 공통 설정 행 (toggle 있는 버전)
function SettingRow({
  icon, label, sub, children, onClick,
}: {
  icon: React.ReactNode; label: string; sub?: string
  children?: React.ReactNode; onClick?: () => void
}) {
  return (
    <div
      className={`msl-row${onClick ? ' msl-row--btn' : ''}`}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={onClick ? (e => { if (e.key === 'Enter') onClick() }) : undefined}
    >
      <span className="msl-row-icon">{icon}</span>
      <div className="msl-row-text">
        <p className="msl-row-label">{label}</p>
        {sub && <p className="msl-row-sub">{sub}</p>}
      </div>
      {children && <div className="msl-row-control">{children}</div>}
    </div>
  )
}

// 섹션 헤더
function SectionHeader({ title }: { title: string }) {
  return <p className="msl-section-header">{title}</p>
}

/* ════════════════════════════════════════════════════════════════════════════
   네트워크 패널
   ════════════════════════════════════════════════════════════════════════════ */
const MOCK_WIFI = [
  { ssid: 'LGHome_5G', signal: 4, secured: true, connected: true },
  { ssid: 'KT_WiFi_2.4G', signal: 3, secured: true, connected: false },
  { ssid: 'SK_7F_Guest', signal: 2, secured: false, connected: false },
  { ssid: 'iPhone (민주)', signal: 1, secured: true, connected: false },
]

function SignalBars({ level }: { level: number }) {
  return (
    <div className="msl-signal">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={`msl-signal-bar${i <= level ? ' msl-signal-bar--on' : ''}`}
          style={{ height: 4 + i * 3 }} />
      ))}
    </div>
  )
}

function NetworkPanel() {
  const [wifiOn, setWifiOn] = useState(true)
  return (
    <div className="msl-content">
      <h2 className="msl-panel-title">네트워크</h2>

      <div className="msl-card">
        <SectionHeader title="무선 연결" />
        <SettingRow
          icon={<Icon><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx={12} cy={20} r={1} fill="currentColor"/></Icon>}
          label="Wi-Fi"
          sub="무선 인터넷 연결"
        >
          <TVToggle value={wifiOn} onChange={setWifiOn} />
        </SettingRow>

        {wifiOn && (
          <div className="msl-wifi-list">
            {MOCK_WIFI.map(net => (
              <button key={net.ssid} type="button" className={`msl-wifi-item${net.connected ? ' msl-wifi-item--connected' : ''}`}
                tabIndex={0}>
                <SignalBars level={net.signal} />
                <span className="msl-wifi-ssid">{net.ssid}</span>
                {net.secured && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}
                    strokeLinecap="round" width={13} height={13} style={{ opacity: .5 }}>
                    <rect x={3} y={11} width={18} height={11} rx={2} ry={2}/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                )}
                {net.connected && <span className="msl-wifi-connected-chip">연결됨</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="msl-card">
        <SectionHeader title="유선 연결" />
        <SettingRow
          icon={<Icon><rect x={2} y={8} width={4} height={8} rx={1}/><rect x={10} y={4} width={4} height={16} rx={1}/><rect x={18} y={8} width={4} height={8} rx={1}/><line x1={6} y1={12} x2={10} y2={12}/><line x1={14} y1={12} x2={18} y2={12}/></Icon>}
          label="유선 LAN"
          sub="이더넷 포트 연결 상태"
        >
          <span className="msl-status-chip msl-status-chip--off">미연결</span>
        </SettingRow>
      </div>

      <div className="msl-card">
        <SectionHeader title="네트워크 정보" />
        <div className="msl-info-grid">
          {[
            { label: 'IP 주소', val: '192.168.1.105' },
            { label: '서브넷 마스크', val: '255.255.255.0' },
            { label: 'DNS', val: '8.8.8.8' },
            { label: 'MAC 주소', val: 'B4:A9:FC:3D:12:08' },
          ].map(row => (
            <div key={row.label} className="msl-info-row">
              <span className="msl-info-label">{row.label}</span>
              <span className="msl-info-val">{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   화면/소리 패널
   ════════════════════════════════════════════════════════════════════════════ */
function DisplayPanel() {
  const [brightness, setBrightness]   = useState(70)
  const [contrast,   setContrast]     = useState(55)
  const [colorTemp,  setColorTemp]    = useState<'cool'|'neutral'|'warm'>('neutral')
  const [volume,     setVolume]       = useState(40)
  const [soundMode,  setSoundMode]    = useState<'standard'|'cinema'|'music'|'sports'>('standard')
  const [eyeCare,    setEyeCare]      = useState(true)

  const TEMP_OPTS = ['cool', 'neutral', 'warm'] as const
  const SOUND_OPTS = [
    { id: 'standard', label: '표준' },
    { id: 'cinema',   label: '영화' },
    { id: 'music',    label: '음악' },
    { id: 'sports',   label: '스포츠' },
  ] as const

  return (
    <div className="msl-content">
      <h2 className="msl-panel-title">화면/소리</h2>

      <div className="msl-card">
        <SectionHeader title="디스플레이" />
        <TVSlider label="밝기" value={brightness} min={0} max={100} step={5}
          onChange={setBrightness} accent="#7C4DFF" />
        <TVSlider label="명암" value={contrast} min={0} max={100} step={5}
          onChange={setContrast} accent="#7C4DFF" />

        <div className="msl-segment-row">
          <span className="msl-segment-label">색온도</span>
          <div className="msl-segment">
            {TEMP_OPTS.map(o => (
              <button key={o} type="button" tabIndex={0}
                className={`msl-seg-btn${colorTemp === o ? ' msl-seg-btn--active' : ''}`}
                onClick={() => setColorTemp(o)}
                onKeyDown={e => { if (e.key === 'Enter') setColorTemp(o) }}>
                {{ cool: '차가운', neutral: '표준', warm: '따뜻한' }[o]}
              </button>
            ))}
          </div>
        </div>

        <SettingRow
          icon={<Icon><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/></Icon>}
          label="눈 보호 모드"
          sub="블루라이트 차단 및 화면 색조 조정"
        >
          <TVToggle value={eyeCare} onChange={setEyeCare} accent="#4CAF50" />
        </SettingRow>
      </div>

      <div className="msl-card">
        <SectionHeader title="오디오" />
        <TVSlider label="음량" value={volume} min={0} max={100} step={5}
          onChange={setVolume} accent="#FF8C42" />

        <div className="msl-segment-row">
          <span className="msl-segment-label">음향 모드</span>
          <div className="msl-segment">
            {SOUND_OPTS.map(o => (
              <button key={o.id} type="button" tabIndex={0}
                className={`msl-seg-btn${soundMode === o.id ? ' msl-seg-btn--active' : ''}`}
                onClick={() => setSoundMode(o.id)}
                onKeyDown={e => { if (e.key === 'Enter') setSoundMode(o.id) }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   가족 보호 패널 – 자녀 프로필 카드 목록
   ════════════════════════════════════════════════════════════════════════════ */
// ─── PIN 게이트 모달 ──────────────────────────────────────────────────────────
const CORRECT_PIN = '1234'  // 실제 구현 시 저장된 PIN 사용

function PinGateModal({
  profileName,
  profileColor,
  onSuccess,
  onCancel,
}: {
  profileName: string
  profileColor: string
  onSuccess: () => void
  onCancel: () => void
}) {
  const [digits, setDigits]   = useState<string[]>(['', '', '', ''])
  const [shake,  setShake]    = useState(false)
  const [error,  setError]    = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // 자동 포커스
  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  function handleDigit(idx: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[idx] = val.slice(-1)
    setDigits(next)
    setError(false)
    if (val && idx < 3) inputRefs.current[idx + 1]?.focus()
    // 4자리 완성 → 검증
    if (val && idx === 3) {
      const pin = [...next.slice(0, 3), val.slice(-1)].join('')
      setTimeout(() => checkPin(pin, [...next.slice(0, 3), val.slice(-1)]), 80)
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
    if (e.key === 'Enter') {
      checkPin(digits.join(''), digits)
    }
  }

  function checkPin(pin: string, currentDigits: string[]) {
    if (pin === CORRECT_PIN) {
      onSuccess()
    } else {
      setShake(true)
      setError(true)
      setDigits(['', '', '', ''])
      setTimeout(() => {
        setShake(false)
        inputRefs.current[0]?.focus()
      }, 500)
    }
  }

  return (
    <motion.div className="pin-backdrop"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="pin-modal"
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}>

        {/* 아바타 + 이름 */}
        <div className="pin-profile-row">
          <div className="pin-avatar" style={{ background: profileColor }}>
            {profileName[0]}
          </div>
          <div>
            <p className="pin-title">
              <span style={{ color: profileColor }}>{profileName}</span> 설정
            </p>
            <p className="pin-sub">보호자 비밀번호를 입력하세요</p>
          </div>
        </div>

        {/* 숫자 입력 4칸 */}
        <motion.div
          className={`pin-dots${error ? ' pin-dots--error' : ''}`}
          animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.45 }}
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={d}
              className={`pin-input${d ? ' pin-input--filled' : ''}${error ? ' pin-input--error' : ''}`}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              tabIndex={0}
            />
          ))}
        </motion.div>

        {error && (
          <motion.p className="pin-error-msg"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
            비밀번호가 틀렸습니다. 다시 시도해주세요.
          </motion.p>
        )}

        <p className="pin-hint">힌트: 기본 비밀번호는 <strong>1234</strong>입니다</p>

        <button type="button" className="pin-cancel-btn" onClick={onCancel}>
          취소
        </button>
      </motion.div>
    </motion.div>
  )
}

function FamilyPanel({
  profiles,
  onOpenDetail,
  onOpenJointView,
}: {
  profiles: ChildProfile[]
  onOpenDetail: (id: string) => void
  onOpenJointView: () => void
}) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  // 가상 시청 기록
  const todayMins: Record<string, number> = { mina: 45, junsu: 60 }

  const pendingProfile = profiles.find(p => p.id === pendingId)

  return (
    <div className="msl-content" style={{ position: 'relative' }}>

      {/* PIN 게이트 모달 */}
      <AnimatePresence>
        {pendingId && pendingProfile && (
          <PinGateModal
            profileName={pendingProfile.name}
            profileColor={pendingProfile.color}
            onSuccess={() => { setPendingId(null); onOpenDetail(pendingId) }}
            onCancel={() => setPendingId(null)}
          />
        )}
      </AnimatePresence>

      <div className="msl-family-header">
        <div className="msl-family-logo">
          <span style={{ color: '#FF4444' }}>K</span>
          <span style={{ color: '#FF8C00' }}>i</span>
          <span style={{ color: '#FFD700' }}>d</span>
          <span style={{ color: '#4CAF50' }}>s</span>
        </div>
        <div>
          <h2 className="msl-panel-title" style={{ margin: 0 }}>가족 보호</h2>
          <p className="msl-family-desc">자녀 프로필을 선택해 시청 시간과 등급을 관리하세요</p>
        </div>
      </div>

      {/* 자녀 프로필 카드 */}
      <div className="msl-family-cards">
        {profiles.map(p => {
          const theme = getThemeByAge(p.age)
          const usedMins = todayMins[p.id] ?? 0
          const remaining = Math.max(0, p.timeLimit - usedMins)
          const pct = Math.min(100, (usedMins / p.timeLimit) * 100)

          return (
            <motion.button
              key={p.id}
              type="button"
              className="msl-family-card"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              onClick={() => setPendingId(p.id)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') setPendingId(p.id) }}
            >
              {/* 상단 컬러 바 */}
              <div className="msl-fc-bar" style={{ background: p.color }} />

              {/* 아바타 + 이름 */}
              <div className="msl-fc-top">
                <div className="msl-fc-avatar" style={{ background: p.color }}>
                  {p.name[0]}
                </div>
                <div className="msl-fc-info">
                  <span className="msl-fc-name">{p.name}</span>
                  <span className="msl-fc-age-chip" style={{ background: theme.accent }}>
                    {p.age}세 · {theme.label.split('·')[0]}
                  </span>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  strokeLinecap="round" width={16} height={16}
                  style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)' }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              {/* 통계 행 */}
              <div className="msl-fc-stats">
                <div className="msl-fc-stat">
                  <p className="msl-fc-stat-label">오늘 시청</p>
                  <p className="msl-fc-stat-val">{usedMins}분</p>
                </div>
                <div className="msl-fc-divider" />
                <div className="msl-fc-stat">
                  <p className="msl-fc-stat-label">남은 시간</p>
                  <p className="msl-fc-stat-val"
                    style={{ color: remaining < 20 ? '#FF5722' : theme.accent }}>
                    {remaining}분
                  </p>
                </div>
                <div className="msl-fc-divider" />
                <div className="msl-fc-stat">
                  <p className="msl-fc-stat-label">제한</p>
                  <p className="msl-fc-stat-val">{p.timeLimit}분</p>
                </div>
              </div>

              {/* 진행 바 */}
              <div className="msl-fc-progress">
                <div className="msl-fc-progress-fill"
                  style={{ width: `${pct}%`, background: pct >= 90 ? '#FF5722' : p.color }} />
              </div>
              <p className="msl-fc-progress-label">
                오늘 {usedMins}/{p.timeLimit}분 ({Math.round(pct)}%)
              </p>

              {/* 등급 + 보호 뱃지 */}
              <div className="msl-fc-badges">
                <span className="msl-fc-badge">🎬 전체관람가</span>
                <span className="msl-fc-badge msl-fc-badge--on">🛡 보호 중</span>
              </div>
            </motion.button>
          )
        })}

        {/* 프로필 추가 카드 */}
        <motion.div className="msl-family-card msl-family-card--add"
          whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          tabIndex={0}
          onKeyDown={e => { /* navigate to profile-create */ }}
        >
          <div className="msl-fc-add-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" width={28} height={28}>
              <line x1={12} y1={5} x2={12} y2={19} />
              <line x1={5} y1={12} x2={19} y2={12} />
            </svg>
          </div>
          <p className="msl-fc-add-label">자녀 프로필 추가</p>
        </motion.div>

        {/* 공동 시청 모드 카드 */}
        <motion.button
          type="button"
          className="msl-family-card msl-family-card--joint"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          onClick={onOpenJointView}
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') onOpenJointView() }}
        >
          <div className="msl-fc-bar" style={{ background: 'linear-gradient(90deg,#FF8C42,#5B9BD5)' }} />
          <div className="msl-fc-top">
            <div className="msl-joint-avatars">
              {profiles.slice(0, 2).map((p, i) => (
                <div key={p.id} className="msl-joint-avatar"
                  style={{ background: p.color, marginLeft: i > 0 ? -12 : 0, zIndex: 2 - i }}>
                  {p.name[0]}
                </div>
              ))}
            </div>
            <div className="msl-fc-info">
              <span className="msl-fc-name">공동 시청 모드</span>
              <span className="msl-fc-age-chip" style={{ background: 'linear-gradient(90deg,#FF8C42,#5B9BD5)' }}>
                가족 함께 시청
              </span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" width={16} height={16}
              style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)' }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <p className="msl-joint-desc">
            자녀 연령 교집합 기반 권장 등급을 자동으로 제안합니다
          </p>
          <div className="msl-fc-badges">
            <span className="msl-fc-badge">👨‍👩‍👧‍👦 {profiles.length}명 참여</span>
            <span className="msl-fc-badge msl-fc-badge--on">🎬 권장 등급 산출 가능</span>
          </div>
        </motion.button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   시스템 패널
   ════════════════════════════════════════════════════════════════════════════ */
function SystemPanel() {
  const [autoTime, setAutoTime]   = useState(true)
  const [autoOff,  setAutoOff]    = useState<'off'|'2h'|'4h'|'8h'>('off')

  const AUTO_OFF_OPTS = [
    { id: 'off', label: '꺼짐' },
    { id: '2h',  label: '2시간' },
    { id: '4h',  label: '4시간' },
    { id: '8h',  label: '8시간' },
  ] as const

  return (
    <div className="msl-content">
      <h2 className="msl-panel-title">시스템</h2>

      <div className="msl-card">
        <SectionHeader title="소프트웨어" />
        <SettingRow
          icon={<Icon><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></Icon>}
          label="소프트웨어 버전"
          sub="webOS 7.3.0-2024.12"
        >
          <span className="msl-status-chip msl-status-chip--ok">최신 버전</span>
        </SettingRow>
        <SettingRow
          icon={<Icon><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1={12} y1={3} x2={12} y2={15}/></Icon>}
          label="업데이트 확인"
          sub="최신 소프트웨어를 확인합니다"
          onClick={() => {}}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" width={14} height={14} style={{ opacity: .4 }}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </SettingRow>
      </div>

      <div className="msl-card">
        <SectionHeader title="날짜/시간" />
        <SettingRow
          icon={<Icon><circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/></Icon>}
          label="자동 날짜/시간 설정"
          sub="네트워크 시간 자동 동기화"
        >
          <TVToggle value={autoTime} onChange={setAutoTime} />
        </SettingRow>
        {!autoTime && (
          <div className="msl-manual-time">
            <span className="msl-info-label">현재 시간</span>
            <span className="msl-info-val msl-info-val--editable">2026. 3. 15. 오후 3:24</span>
          </div>
        )}
      </div>

      <div className="msl-card">
        <SectionHeader title="언어" />
        <SettingRow
          icon={<Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>}
          label="메뉴 언어"
          sub="TV 인터페이스 언어"
        >
          <span className="msl-status-chip">한국어</span>
        </SettingRow>
      </div>

      <div className="msl-card">
        <SectionHeader title="절전" />
        <div className="msl-segment-row">
          <span className="msl-segment-label">자동 종료</span>
          <div className="msl-segment">
            {AUTO_OFF_OPTS.map(o => (
              <button key={o.id} type="button" tabIndex={0}
                className={`msl-seg-btn${autoOff === o.id ? ' msl-seg-btn--active' : ''}`}
                onClick={() => setAutoOff(o.id)}
                onKeyDown={e => { if (e.key === 'Enter') setAutoOff(o.id) }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   공동 시청 모드 패널
   ════════════════════════════════════════════════════════════════════════════ */

// 연령 교집합 → 권장 등급 계산
function getRecommendedRating(profiles: ChildProfile[]): { label: string; color: string; desc: string } {
  if (profiles.length === 0) return { label: '전체관람가', color: '#4CAF50', desc: '모든 연령 시청 가능' }
  const minAge = Math.min(...profiles.map(p => p.age))
  if (minAge < 7)  return { label: '전체관람가', color: '#4CAF50', desc: '영유아 포함 — 전체관람가 콘텐츠만 허용' }
  if (minAge < 12) return { label: '7세 이상', color: '#8BC34A', desc: '7세 미만 없음 — 7세 이상 콘텐츠 허용' }
  if (minAge < 15) return { label: '12세 이상', color: '#FFC107', desc: '12세 미만 없음 — 12세 이상 콘텐츠 허용' }
  return { label: '15세 이상', color: '#FF5722', desc: '15세 이상 자녀만 있는 경우' }
}

function JointViewPanel({
  profiles,
  onBack,
}: {
  profiles: ChildProfile[]
  onBack: () => void
}) {
  const rec = getRecommendedRating(profiles)
  const [jointTime, setJointTime] = useState(120)
  const [jointOn, setJointOn] = useState(false)

  return (
    <div className="msl-content">
      {/* 헤더 */}
      <div className="jvp-header">
        <button type="button" className="jvp-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" width={16} height={16}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          뒤로가기
        </button>
        <div>
          <h2 className="msl-panel-title" style={{ margin: 0 }}>공동 시청 모드</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: '4px 0 0' }}>
            가족이 함께 TV를 볼 때 적용할 설정입니다
          </p>
        </div>
      </div>

      {/* 참여 프로필 */}
      <div className="msl-card">
        <SectionHeader title="참여 자녀" />
        <div className="jvp-profile-row">
          {profiles.map(p => {
            const theme = getThemeByAge(p.age)
            return (
              <div key={p.id} className="jvp-profile-chip">
                <div className="jvp-avatar" style={{ background: p.color }}>{p.name[0]}</div>
                <span className="jvp-avatar-name">{p.name}</span>
                <span className="jvp-avatar-age" style={{ color: theme.accent }}>{p.age}세</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 권장 등급 */}
      <div className="msl-card jvp-rec-card" style={{ borderColor: rec.color + '44' }}>
        <SectionHeader title="권장 공통 등급" />
        <div className="jvp-rec-body">
          <div className="jvp-rec-badge" style={{ background: rec.color + '22', borderColor: rec.color + '66', color: rec.color }}>
            <span className="jvp-rec-label">{rec.label}</span>
          </div>
          <div className="jvp-rec-desc">
            <p className="jvp-rec-reason">{rec.desc}</p>
            <p className="jvp-rec-note">
              💡 가장 어린 자녀(
              <strong style={{ color: '#fff' }}>{Math.min(...profiles.map(p => p.age))}세</strong>
              )를 기준으로 적절한 등급이 자동 선택됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 공동 시청 시간 */}
      <div className="msl-card">
        <SectionHeader title="공동 시청 시간 제한" />
        <SettingRow
          icon={<Icon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>}
          label="공동 시청 모드 활성화"
          sub="켜면 공동 시청 등급이 개인 설정을 오버라이드합니다"
        >
          <TVToggle value={jointOn} onChange={setJointOn} accent={rec.color} />
        </SettingRow>

        {jointOn && (
          <div style={{ paddingTop: 8 }}>
            <TVSlider
              label="공동 시청 시간 제한"
              value={jointTime} min={30} max={240} step={10}
              onChange={setJointTime} accent={rec.color}
            />
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '8px 0 0' }}>
              공동 시청 시 최대 <strong style={{ color: '#fff' }}>{jointTime}분</strong>까지 허용됩니다
            </p>
          </div>
        )}
      </div>

      {/* 참여 채널 설명 */}
      <div className="msl-card">
        <SectionHeader title="적용 범위" />
        {[
          { icon: '📺', label: '라이브 TV', sub: 'LG 채널 및 외부 입력' },
          { icon: '🎬', label: 'VOD · OTT', sub: 'LG 채널 스토어 앱 콘텐츠' },
          { icon: '▶️', label: 'YouTube', sub: 'YouTube 보호 모드 연동' },
        ].map(row => (
          <SettingRow key={row.label}
            icon={<span style={{ fontSize: 16 }}>{row.icon}</span>}
            label={row.label}
            sub={row.sub}
          >
            <span className={`msl-status-chip${jointOn ? ' msl-status-chip--ok' : ''}`}>
              {jointOn ? '적용 중' : '대기'}
            </span>
          </SettingRow>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   스마트캠 케어 패널
   ════════════════════════════════════════════════════════════════════════════ */
// 스마트캠 AI 기능 목록
const SMARTCAM_FEATURES = [
  {
    key: 'posture',
    label: 'AI 자세 교정',
    sub_on:  '구부정한 자세 감지 시 경고음과 화면 알림을 보냅니다',
    sub_off: '자세가 나빠지면 알림을 보내 바른 자세를 유도합니다',
    accent: '#7C4DFF',
    overlayLabel: '자세 분석 중',
    overlayColor: '#7C4DFF',
    icon: (
      <Icon>
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
      </Icon>
    ),
  },
  {
    key: 'blink',
    label: '눈 깜박임 감지',
    sub_on:  '눈 깜박임이 감소하면 눈 피로 알림을 보냅니다',
    sub_off: '장시간 집중 시청으로 인한 안구 건조증을 예방합니다',
    accent: '#5B9BD5',
    overlayLabel: '눈 깜박임 감지 중',
    overlayColor: '#5B9BD5',
    icon: (
      <Icon>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx={12} cy={12} r={3}/>
        <path d="M12 5v2M12 17v2M5 12H3M21 12h-2" strokeWidth={1.3}/>
      </Icon>
    ),
  },
  {
    key: 'distance',
    label: '시청 거리 감지',
    sub_on:  '권장 거리(1.5m~3m)보다 가깝게 앉으면 알림을 보냅니다',
    sub_off: 'TV와 너무 가까운 시청 거리를 감지하여 알립니다',
    accent: '#FF8C42',
    overlayLabel: '거리 측정 중',
    overlayColor: '#FF8C42',
    icon: (
      <Icon>
        <path d="M3 3h18M3 21h18"/>
        <path d="M3 12h4M17 12h4"/>
        <path d="M12 7v10"/>
        <path d="M9 10l3-3 3 3M9 14l3 3 3-3" strokeWidth={1.4}/>
      </Icon>
    ),
  },
] as const

type FeatureKey = typeof SMARTCAM_FEATURES[number]['key']

function SmartCamPanel() {
  const [camOn,      setCamOn]      = useState(false)
  const [features,   setFeatures]   = useState<Record<FeatureKey, boolean>>({
    posture: false, blink: false, distance: false,
  })
  const [remotePerm, setRemotePerm] = useState(false)
  const [recording,  setRecording]  = useState(false)

  const activeFeatures = SMARTCAM_FEATURES.filter(f => features[f.key])

  function toggleFeature(key: FeatureKey, v: boolean) {
    setFeatures(prev => ({ ...prev, [key]: v }))
    if (v && !camOn) setCamOn(true)
  }

  return (
    <div className="msl-content">
      <h2 className="msl-panel-title">스마트캠 케어</h2>

      {/* 카메라 미리보기 */}
      <div className="msl-card scp-preview-card">
        <div className="scp-feed">
          {camOn ? (
            <div className="scp-feed-active">
              <div className="scp-feed-overlay">
                {/* 활성 기능별 오버레이 칩 */}
                <div className="scp-overlay-chips">
                  {activeFeatures.map(f => (
                    <div key={f.key} className="scp-overlay-chip"
                      style={{ borderColor: f.overlayColor + '88', color: f.overlayColor }}>
                      <span className="scp-chip-dot" style={{ background: f.overlayColor }} />
                      {f.overlayLabel}
                    </div>
                  ))}
                </div>
                {/* 자세 교정 점선 박스 */}
                {features.posture && (
                  <div className="scp-posture-box">
                    <div className="scp-posture-box-inner"
                      style={{ borderColor: '#7C4DFF' + 'bb' }} />
                    <span className="scp-posture-label">자세 감지 영역</span>
                  </div>
                )}
                {/* 시청 거리 측정 선 */}
                {features.distance && (
                  <div className="scp-distance-ruler">
                    <div className="scp-dist-line" />
                    <span className="scp-dist-label" style={{ color: '#FF8C42' }}>
                      📐 1.5m~3m 권장
                    </span>
                  </div>
                )}
                <div className="scp-feed-badge">
                  <span className="scp-rec-dot" />
                  LIVE
                </div>
              </div>
              <div className="scp-mock-scene">
                <div className="scp-silhouette" />
              </div>
            </div>
          ) : (
            <div className="scp-feed-off">
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)"
                strokeWidth={1.5} strokeLinecap="round" width={48} height={48}>
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x={1} y={5} width={15} height={14} rx={2} />
                <line x1={1} y1={1} x2={23} y2={23} />
              </svg>
              <p className="scp-feed-off-label">카메라가 꺼져 있습니다</p>
            </div>
          )}
        </div>

        <SettingRow
          icon={<Icon><path d="M23 7l-7 5 7 5V7z"/><rect x={1} y={5} width={15} height={14} rx={2} ry={2}/></Icon>}
          label="스마트캠 활성화"
          sub={camOn ? `${activeFeatures.length}개 기능 실행 중` : '카메라를 켜면 AI 분석이 시작됩니다'}
        >
          <TVToggle value={camOn} onChange={v => { setCamOn(v); if (!v) setFeatures({ posture: false, blink: false, distance: false }) }} accent="#FF8C42" />
        </SettingRow>
      </div>

      {/* AI 기능 3종 */}
      <div className="msl-card">
        <SectionHeader title="AI 감지 기능" />
        {SMARTCAM_FEATURES.map(f => (
          <SettingRow
            key={f.key}
            icon={f.icon}
            label={f.label}
            sub={features[f.key] ? f.sub_on : f.sub_off}
          >
            <TVToggle
              value={features[f.key]}
              onChange={v => toggleFeature(f.key, v)}
              accent={f.accent}
            />
          </SettingRow>
        ))}

        {/* 활성 기능 상태 요약 칩 */}
        {camOn && activeFeatures.length > 0 && (
          <div className="scp-active-summary">
            {activeFeatures.map(f => (
              <span key={f.key} className="scp-active-chip"
                style={{ borderColor: f.accent + '55', color: f.accent, background: f.accent + '14' }}>
                ✓ {f.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 원격 모니터링 */}
      <div className="msl-card">
        <SectionHeader title="원격 확인 권한" />
        <SettingRow
          icon={<Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>}
          label="원격 모니터링 허용"
          sub={remotePerm
            ? '보호자 앱에서 실시간으로 확인할 수 있습니다'
            : '허용하면 LG ThinQ 앱에서 카메라 피드를 확인 가능합니다'}
        >
          <TVToggle value={remotePerm} onChange={v => { setRemotePerm(v); if (v && !camOn) setCamOn(true) }} accent="#4CAF50" />
        </SettingRow>

        <SettingRow
          icon={<Icon><circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/></Icon>}
          label="이벤트 자동 녹화"
          sub={recording ? '이상 자세·거리 감지 시 30초 자동 녹화' : '이벤트 기반 자동 녹화가 꺼져 있습니다'}
        >
          <TVToggle value={recording} onChange={setRecording} accent="#FF5722" />
        </SettingRow>

        {remotePerm && (
          <div className="scp-perm-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5B9BD5" strokeWidth={1.8}
              strokeLinecap="round" width={15} height={15}>
              <circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={12}/><line x1={12} y1={16} x2={12.01} y2={16}/>
            </svg>
            <span>LG ThinQ 앱에서 알림 및 실시간 피드를 확인할 수 있습니다. 개인 정보 보호를 위해 가족 외 공유를 금지합니다.</span>
          </div>
        )}
      </div>
    </div>
  )
}
