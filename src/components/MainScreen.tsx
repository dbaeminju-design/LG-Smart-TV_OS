// 01_main – LG webOS 스타일 TV 홈 화면 + 프로필 계정 패널 (framer-motion)
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { ScreenId } from '../data/kidsProfileFlow'
import { getThemeByAge } from '../data/profiles'
import type { ChildProfile } from '../data/profiles'

type MainScreenProps = {
  onNavigate: (screen: ScreenId) => void
  profiles: ChildProfile[]
  activeProfileId: string
  onSelectKidsProfile: (profileId: string) => void
}

// ─── 패널 오버레이 배리언트 ─────────────────────────────────────────────────
const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
}
const panelVariants = {
  hidden:  { x: -440, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 24, stiffness: 220 } },
  exit:    { x: -440, opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
}
const modalVariants = {
  hidden:  { scale: 0.88, opacity: 0, y: 20 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 260 } },
  exit:    { scale: 0.92, opacity: 0, y: 8, transition: { duration: 0.18 } },
}

export function MainScreen({ onNavigate, profiles, activeProfileId, onSelectKidsProfile }: MainScreenProps) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const closeAll = () => { setPanelOpen(false); setShowAddModal(false) }

  function handleKidsSelect(profileId: string) {
    closeAll()
    onSelectKidsProfile(profileId)
    onNavigate('kids-main')
  }

  function handleAddKids() {
    setPanelOpen(false)
    onNavigate('profile-create')
  }

  function handleAddAdult() {
    closeAll()
    onNavigate('profile-type')
  }

  return (
    <div className="screen wos-screen" data-theme="adult">

      {/* ── 좌측 사이드바 ── */}
      <nav className="wos-sidenav">
        {/* 프로필 버튼 */}
        <button
          type="button"
          className={`wos-profile-btn${panelOpen ? ' wos-profile-btn--active' : ''}`}
          onClick={() => { setShowAddModal(false); setPanelOpen(v => !v) }}
          aria-label="계정 메뉴"
        >L</button>

        <NavIcon title="알림">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </NavIcon>
        <NavIcon title="설정" onClick={() => onNavigate('settings')}>
          <circle cx={12} cy={12} r={3} />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </NavIcon>
        <NavIcon title="검색">
          <circle cx={11} cy={11} r={8} />
          <line x1={21} y1={21} x2={16.65} y2={16.65} />
        </NavIcon>
      </nav>

      {/* ── 메인 콘텐츠 영역 ── */}
      <main className={`wos-main${panelOpen ? ' wos-main--dimmed' : ''}`}>
        {/* 히어로 배너 */}
        <section className="wos-hero">
          <img className="wos-hero-img" src="/img/img_thumbnail_big_01.png" alt="고래" />
          <img className="wos-hero-img" src="/img/img_thumbnail_big_02.png" alt="우주" />
        </section>

        {/* 카테고리 칩 */}
        <div className="wos-cat-row">
          {[
            { label: '홈 오피스',    color: '#3ECFBF' },
            { label: '쉬운 사용',    color: '#E07D5C' },
            { label: '뮤직',         color: '#B57BE8' },
            { label: '스마트 홈 안심', color: '#4AAEF5' },
            { label: '편집',         color: '#8B8FA8' },
          ].map((c) => (
            <button key={c.label} type="button" className="wos-cat-chip" style={{ background: c.color }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* 앱 아이콘 */}
        <div className="wos-app-row">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="wos-app-icon">
              <img src={`/img/img_app_0${n}.png`} alt={`앱 ${n}`} />
            </div>
          ))}
        </div>

        {/* 콘텐츠 그리드 */}
        <div className="wos-content-grid">
          {[
            { label: '최근 외부입력',    file: 'img_thumbnail_small_01.png' },
            { label: 'Admin 01 Content', file: 'img_thumbnail_small_02.png' },
            { label: '20260314',         file: 'img_thumbnail_small_03.png' },
            { label: '20260314',         file: 'img_thumbnail_small_04.png' },
          ].map((item) => (
            <div key={item.file} className="wos-content-card">
              <p className="wos-content-label">{item.label}</p>
              <img className="wos-content-thumb" src={`/img/${item.file}`} alt={item.label} />
            </div>
          ))}
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════
          계정 패널 + 딤 오버레이  (AnimatePresence로 진입/퇴장)
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* 딤 */}
            <motion.div
              className="wos-backdrop"
              variants={backdropVariants}
              initial="hidden" animate="visible" exit="hidden"
              transition={{ duration: 0.25 }}
              onClick={closeAll}
            />

            {/* 패널 */}
            <motion.aside
              className="wos-account-panel"
              variants={panelVariants}
              initial="hidden" animate="visible" exit="exit"
            >
              {/* 헤더 */}
              <div className="wap-header">
                <span className="wap-title">LG전자 계정</span>
                <button type="button" className="wap-more" aria-label="더보기">
                  <svg viewBox="0 0 4 18" fill="currentColor" width={4} height={18}>
                    <circle cx={2} cy={2}  r={1.6} />
                    <circle cx={2} cy={9}  r={1.6} />
                    <circle cx={2} cy={16} r={1.6} />
                  </svg>
                </button>
              </div>

              {/* 성인 계정 (항상 고정) */}
              <div className="wap-account-row wap-account-row--active">
                <div className="wap-avatar wap-avatar--purple">L</div>
                <span className="wap-name">삼삼오오</span>
                <div className="wap-vline" />
                {/* 설정 버튼 */}
                <button type="button" className="wap-settings-btn" aria-label="설정"
                  onClick={() => { closeAll(); onNavigate('settings') }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                    strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
                    <circle cx={12} cy={12} r={3} />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </button>
                <button type="button" className="wap-logout" aria-label="로그아웃">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                    strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1={21} y1={12} x2={9} y2={12} />
                  </svg>
                </button>
              </div>

              {/* 키즈 통합 항목 */}
              {profiles.length > 0 && (
                <button
                  type="button"
                  className="wap-account-row wap-account-row--btn wap-account-row--kids-group"
                  onClick={() => handleKidsSelect(profiles[0].id)}
                >
                  {/* 겹쳐진 아바타 */}
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
                </button>
              )}

              {/* 추가하기 */}
              <button
                type="button"
                className="wap-account-row wap-account-row--btn wap-account-row--add"
                onClick={() => setShowAddModal(true)}
              >
                <div className="wap-avatar wap-avatar--add">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4}
                    strokeLinecap="round" width={20} height={20}>
                    <line x1={12} y1={5} x2={12} y2={19} />
                    <line x1={5} y1={12} x2={19} y2={12} />
                  </svg>
                </div>
                <span className="wap-name">추가하기</span>
              </button>
            </motion.aside>

            {/* ── 프로필 타입 선택 모달 ── */}
            <AnimatePresence>
              {showAddModal && (
                <motion.div
                  className="wos-modal-wrap"
                  variants={backdropVariants}
                  initial="hidden" animate="visible" exit="hidden"
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="wos-modal"
                    variants={modalVariants}
                    initial="hidden" animate="visible" exit="exit"
                  >
                    <h3 className="wos-modal-title">프로필 유형 선택</h3>
                    <p className="wos-modal-sub">어떤 프로필을 추가할까요?</p>
                    <div className="wos-modal-cards">
                      {/* 일반 프로필 */}
                      <button type="button" className="wos-modal-card" onClick={handleAddAdult}>
                        <div className="wos-modal-card-icon wos-modal-card-icon--adult">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                            strokeLinecap="round" strokeLinejoin="round" width={32} height={32}>
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx={12} cy={7} r={4} />
                          </svg>
                        </div>
                        <p className="wos-modal-card-title">일반 프로필</p>
                        <p className="wos-modal-card-desc">성인 계정으로<br/>모든 콘텐츠 이용</p>
                      </button>

                      {/* 키즈 프로필 */}
                      <button type="button" className="wos-modal-card wos-modal-card--kids" onClick={handleAddKids}>
                        <div className="wos-modal-card-icon wos-modal-card-icon--kids">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                            strokeLinecap="round" strokeLinejoin="round" width={32} height={32}>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx={9} cy={7} r={4} />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <p className="wos-modal-card-title">키즈 프로필</p>
                        <p className="wos-modal-card-desc">연령 맞춤 콘텐츠<br/>자녀 보호 기능 포함</p>
                        <span className="wos-modal-card-badge">추천</span>
                      </button>
                    </div>
                    <button type="button" className="wos-modal-cancel" onClick={() => setShowAddModal(false)}>
                      취소
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── 아이콘 헬퍼 ───────────────────────────────────────────────────────────
function NavIcon({ title, children, onClick }: { title: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className={`wos-nav-icon${onClick ? ' wos-nav-icon--active' : ''}`}
      title={title} onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
        strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        {children}
      </svg>
    </button>
  )
}
