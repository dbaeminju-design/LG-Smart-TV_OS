// 04_키즈 통합 홈 – KidsLayout + KidsContentCard 기반 표준화
// 모든 모드(미나/준수/공동)에서 동일한 DOM 구조, CSS 변수로 색상만 교체
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { ScreenId } from '../data/kidsProfileFlow'
import { KIDS_CATEGORIES } from '../data/kidsProfileFlow'
import type { ChildProfile } from '../data/profiles'
import { getThemeByAge, getContentsByAge, getCombinedRecommendations } from '../data/profiles'
import { KidsLayout } from './KidsLayout'
import { KidsContentCard } from './KidsContentCard'

// ─── 애니메이션 배리언트 ──────────────────────────────────────────────────────
const backdropV = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
const panelV = {
  hidden:  { x: -440, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, damping: 24, stiffness: 220 } },
  exit:    { x: -440, opacity: 0, transition: { duration: 0.22, ease: 'easeIn' as const } },
}
const contentV = {
  enter:  (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { type: 'spring' as const, damping: 22, stiffness: 260 } },
  exit:   (dir: number) => ({ x: dir * -48, opacity: 0, transition: { duration: 0.18 } }),
}

type Props = {
  onNavigate: (screen: ScreenId) => void
  profiles: ChildProfile[]
  activeProfileId: string
  onSwitchProfile: (id: string) => void
  sharedMode: boolean
  onToggleSharedMode: () => void
  onUpdateTimeLimit: (profileId: string, minutes: number) => void
}

export function KidsMainScreen({
  onNavigate, profiles, activeProfileId, onSwitchProfile, sharedMode, onToggleSharedMode,
}: Props) {
  const [activeCategory, setActiveCategory] = useState('home')
  const [selectedId,     setSelectedId]     = useState<string | null>(null)
  const [panelOpen,      setPanelOpen]      = useState(false)
  const [slideDir,       setSlideDir]       = useState(1)

  const activeProfile = profiles.find(p => p.id === activeProfileId) ?? profiles[0]
  const theme         = getThemeByAge(activeProfile.age)
  const isBaby        = theme.style === 'baby'

  // 콘텐츠 데이터
  const contents = sharedMode
    ? getCombinedRecommendations(profiles)
    : getContentsByAge(activeProfile.age, activeProfile.interests)

  // 배경 그라데이션
  const bg = sharedMode && profiles.length >= 2
    ? `linear-gradient(135deg, ${profiles[0].color}66 0%, ${profiles[1].color}66 100%)`
    : (activeProfile.bgGradient || activeProfile.color)

  // 현재 모드 accent 색상
  const accent = sharedMode && profiles.length >= 2
    ? `linear-gradient(90deg, ${profiles[0].color} 0%, ${profiles[1].color} 100%)`
    : theme.accent

  function switchTab(id: string) {
    const curIdx = profiles.findIndex(p => p.id === activeProfileId)
    const nxtIdx = profiles.findIndex(p => p.id === id)
    setSlideDir(nxtIdx >= curIdx ? 1 : -1)
    if (sharedMode) onToggleSharedMode()
    onSwitchProfile(id)
  }

  function toggleShared() {
    setSlideDir(sharedMode ? -1 : 1)
    onToggleSharedMode()
  }

  // ── 사이드바 콘텐츠 ────────────────────────────────────────────────────────
  const sidebar = (
    <>
      <button
        type="button"
        className={`wos-profile-btn${panelOpen ? ' wos-profile-btn--active' : ''}`}
        style={{
          background: sharedMode && profiles.length >= 2
            ? `linear-gradient(135deg, ${profiles[0].color} 0%, ${profiles[1].color} 100%)`
            : activeProfile.color
        }}
        onClick={() => setPanelOpen(v => !v)}
        aria-label="프로필 메뉴"
      >
        {sharedMode ? '👨‍👩‍👧' : activeProfile.name[0]}
      </button>

      <SideBtn label="알림">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </SideBtn>
      <SideBtn label="설정" onClick={() => onNavigate('settings')}>
        <circle cx={12} cy={12} r={3} />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </SideBtn>
      <SideBtn label="검색">
        <circle cx={11} cy={11} r={8} />
        <line x1={21} y1={21} x2={16.65} y2={16.65} />
      </SideBtn>
    </>
  )

  // ── 상단 탭 바 콘텐츠 ──────────────────────────────────────────────────────
  const topbar = (
    <>
      <div className="kids-tabs">
        {profiles.map(p => {
          const t = getThemeByAge(p.age)
          const isActive = !sharedMode && p.id === activeProfileId
          return (
            <button key={p.id} type="button"
              className={`kids-tab${isActive ? ' kids-tab--active' : ''}`}
              style={isActive ? { background: p.color, borderColor: p.color, color: '#fff' } : {}}
              onClick={() => switchTab(p.id)}
            >
              <div className="kids-tab-dot" style={{ background: p.color }} />
              <span>{p.name}</span>
              <span className="kids-tab-age">{p.age}세</span>
              {isActive && (
                <span className="kids-tab-theme-chip" style={{ background: t.accent }}>
                  {t.label.split('·')[0]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <motion.button
        type="button"
        className={`kids-shared-btn${sharedMode ? ' kids-shared-btn--on' : ''}`}
        style={sharedMode ? {
          background: `linear-gradient(90deg, ${profiles[0]?.color ?? '#ccc'} 0%, ${profiles[1]?.color ?? profiles[0]?.color ?? '#ccc'} 100%)`,
          color: '#fff', borderColor: 'transparent',
        } : {}}
        onClick={toggleShared}
        whileTap={{ scale: 0.95 }}
      >
        <span>{sharedMode ? '👨‍👩‍👧' : '👥'}</span>
        <span>{sharedMode ? '공동 시청 중' : '공동 시청 모드'}</span>
      </motion.button>
    </>
  )

  // ── 하단 고정 푸터 콘텐츠 ──────────────────────────────────────────────────
  const footer = (
    <>
      <div className="kids-vision-bar">
        <div
          className="kids-vision-icon"
          style={{ background: sharedMode && profiles.length >= 2
            ? `linear-gradient(135deg, ${profiles[0].color} 0%, ${profiles[1].color} 100%)`
            : theme.accent }}
        >시력</div>
        <div>
          <p className="kids-vision-title">시력 보호 모드 켜짐</p>
          <p className="kids-vision-sub">영상에 블루라이트 차단 기능이 적용됩니다.</p>
        </div>
      </div>

      <button
        type="button"
        className="kids-char-btn bounce-on-click"
        style={{
          background: sharedMode && profiles.length >= 2
            ? `linear-gradient(135deg, ${profiles[0].color} 0%, ${profiles[1].color} 100%)`
            : theme.accent
        }}
      >
        <span className="kids-char-name">리리</span>
        <div className="kids-char-sub">
          {contents[0]?.title ? `현재 추천 ${contents[0].title}` : '추천 중'}
        </div>
      </button>
    </>
  )

  return (
    <>
      {/* 공동 시청 그라데이션 오버레이 */}
      <AnimatePresence>
        {sharedMode && (
          <motion.div
            className="kids-shared-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: `linear-gradient(120deg,
                ${profiles[0]?.color ?? '#FFB3D1'}44 0%,
                ${profiles[1]?.color ?? '#90C8F0'}44 50%,
                ${profiles[0]?.color ?? '#FFB3D1'}22 100%)`,
            }}
          />
        )}
      </AnimatePresence>

      <KidsLayout
        sidebar={sidebar}
        topbar={topbar}
        footer={footer}
        background={bg}
        themeClass="wos-sidenav--kids"
      >
        {/* 테마 뱃지 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sharedMode ? 'shared-badge' : activeProfileId}
            className="kids-theme-badge"
            style={{ background: accent }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            {sharedMode
              ? `${profiles.map(p => p.name).join(' & ')} 공동 추천`
              : `${activeProfile.name} · ${theme.label}`}
          </motion.div>
        </AnimatePresence>

        {/* 콘텐츠 패널 – 탭/모드 전환 시 슬라이드 */}
        <AnimatePresence mode="wait" custom={slideDir}>
          <motion.div
            key={sharedMode ? 'shared-content' : activeProfileId}
            className="kids-content-panel"
            custom={slideDir}
            variants={contentV}
            initial="enter" animate="center" exit="exit"
          >
            {/* ── 공동 시청 헤더 ── */}
            {sharedMode && (
              <div className="kids-shared-header">
                <span className="kids-shared-header-icon">🎬</span>
                <div>
                  <p className="kids-shared-header-title">
                    {profiles.map(p => `${p.name}(${p.age}세)`).join(' & ')} 함께 보는 추천
                  </p>
                  <p className="kids-shared-header-sub">두 자녀 모두 즐길 수 있는 콘텐츠만 골랐어요</p>
                </div>
              </div>
            )}

            {/* ── 카테고리 탭 (개별 모드만) ── */}
            {!sharedMode && (
              <div className="kids-category-bar">
                {KIDS_CATEGORIES.map(cat => (
                  <button key={cat.id} type="button"
                    className={`kids-cat-chip${cat.id === activeCategory ? ' kids-cat-chip--active' : ''}`}
                    style={cat.id === activeCategory ? { background: theme.accent } : {}}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <span className="kids-cat-emoji">{cat.emoji}</span>
                    {cat.id === activeCategory && (
                      <span className="kids-cat-label">{cat.label}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* ── 섹션 헤더 ── */}
            <div className="kids-section-header">
              <span
                className="kids-section-badge"
                style={{ background: accent }}
              >
                {sharedMode ? '공동추천' : '추천'}
              </span>
              <span className="kids-section-title">
                {sharedMode
                  ? '가족이 함께 즐기는 콘텐츠'
                  : `${activeProfile.name}을 위한 추천 콘텐츠`}
              </span>
            </div>

            {/* ── 콘텐츠 카드 그리드 ──
                • 유아(baby): 2열 grid, size=large
                • 아동/공동: 가로 스크롤 row, size=normal                 */}
            <div className={`kcc-grid${isBaby && !sharedMode ? ' kcc-grid--baby' : ' kcc-grid--row'}`}>
              {isBaby && !sharedMode && (
                <div className="kids-baby-welcome">
                  <span className="kids-baby-wave">👋</span>
                  <p className="kids-baby-hello">안녕, <strong>{activeProfile.name}</strong>!</p>
                </div>
              )}
              {contents.map(item => (
                <KidsContentCard
                  key={item.id}
                  title={item.title}
                  sub={item.sub}
                  color={item.color}
                  badge={item.badge}
                  size={isBaby && !sharedMode ? 'large' : 'normal'}
                  onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </KidsLayout>

      {/* ══ 계정 전환 패널 ══ */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              className="wos-backdrop"
              variants={backdropV} initial="hidden" animate="visible" exit="hidden"
              transition={{ duration: 0.22 }}
              onClick={() => setPanelOpen(false)}
            />
            <motion.aside
              className="wos-account-panel kids-account-panel"
              variants={panelV} initial="hidden" animate="visible" exit="exit"
            >
              <div className="wap-header">
                <span className="wap-title">프로필 전환</span>
                <button type="button" className="wap-more" aria-label="더보기">
                  <svg viewBox="0 0 4 18" fill="currentColor" width={4} height={18}>
                    <circle cx={2} cy={2} r={1.6} />
                    <circle cx={2} cy={9} r={1.6} />
                    <circle cx={2} cy={16} r={1.6} />
                  </svg>
                </button>
              </div>

              {/* 어른 모드 전환 (PIN) */}
              <button
                type="button"
                className="wap-account-row wap-account-row--btn"
                onClick={() => { setPanelOpen(false); onNavigate('pin') }}
              >
                <div className="wap-avatar wap-avatar--purple">L</div>
                <span className="wap-name">삼삼오오</span>
                <span className="wap-kids-chip" style={{ background: '#7B4FC8' }}>어른</span>
                <div className="wap-vline" />
                <span style={{ fontSize: 16, marginLeft: 2 }}>🔒</span>
              </button>

              {/* 키즈 통합 항목 (현재 활성) */}
              {profiles.length > 0 && (
                <div className="wap-account-row wap-account-row--kids-group wap-account-row--kids-active"
                  style={{ borderLeftColor: theme.accent }}
                >
                  <div className="wap-kids-avatars">
                    {profiles.slice(0, 2).map((p, i) => (
                      <div
                        key={p.id}
                        className="wap-avatar wap-avatar--sm"
                        style={{ background: p.color, zIndex: 2 - i, marginLeft: i > 0 ? -10 : 0 }}
                      >
                        {p.name[0]}
                      </div>
                    ))}
                  </div>
                  <span className="wap-name">키즈</span>
                  <span className="wap-kids-chip" style={{
                    background: 'linear-gradient(90deg, #FF8C42 0%, #5B9BD5 100%)',
                  }}>
                    {profiles.length}명
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth={2.5}
                    strokeLinecap="round" strokeLinejoin="round" width={16} height={16}
                    style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {/* 프로필 추가 */}
              <button
                type="button"
                className="wap-account-row wap-account-row--btn wap-account-row--add"
                onClick={() => { setPanelOpen(false); onNavigate('profile-type') }}
              >
                <div className="wap-avatar wap-avatar--add">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4}
                    strokeLinecap="round" width={20} height={20}>
                    <line x1={12} y1={5} x2={12} y2={19} />
                    <line x1={5} y1={12} x2={19} y2={12} />
                  </svg>
                </div>
                <span className="wap-name">프로필 추가</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── 사이드바 아이콘 헬퍼 ──────────────────────────────────────────────────────
function SideBtn({
  label, onClick, children,
}: { label: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="wos-nav-icon wos-nav-icon--kids"
      title={label}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
        width={22} height={22}>
        {children}
      </svg>
    </button>
  )
}
