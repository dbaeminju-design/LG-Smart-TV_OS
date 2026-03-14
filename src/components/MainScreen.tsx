// 01_main – 메인 TV 홈 화면
import type { ScreenId } from '../data/kidsProfileFlow'

type MainScreenProps = {
  onNavigate: (screen: ScreenId) => void
  sidePanelOpen: boolean
  onToggleSidePanel: () => void
  onCloseSidePanel: () => void
}

export function MainScreen({
  onNavigate,
  sidePanelOpen,
  onToggleSidePanel,
  onCloseSidePanel,
}: MainScreenProps) {
  return (
    <div className="screen screen--main">
      {/* 좌측 네비게이션 */}
      <nav className="side-nav">
        <button
          type="button"
          className="btn-profile bp-purple"
          onClick={onToggleSidePanel}
          aria-label="프로필 메뉴"
        >
          L
        </button>
        <div className="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.6}
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div className="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.6}
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx={12} cy={12} r={3} />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <div className="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.6}
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="tv-main">
        <div className="hero">
          <img className="hero-img" src="/img/img_thumbnail_big_01.png" alt="고래" />
          <img className="hero-img" src="/img/img_thumbnail_big_02.png" alt="우주" />
        </div>
        <div className="category-row">
          <button className="cat-btn cat-teal">홈 오피스</button>
          <button className="cat-btn cat-salmon">쉬운 사용</button>
          <button className="cat-btn cat-purple">뮤직</button>
          <button className="cat-btn cat-blue">스마트 홈 안심</button>
          <button className="cat-btn cat-gray">편집</button>
        </div>
        <div className="app-row">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <img
              key={n}
              className="app-icon"
              src={`/img/img_app_0${n}.png`}
              alt={`앱 ${n}`}
            />
          ))}
        </div>
        <div className="content-grid">
          {[
            { label: '최근 외부입력',    file: 'img_thumbnail_small_01.png' },
            { label: 'Admin 01 Content', file: 'img_thumbnail_small_02.png' },
            { label: '20260314',         file: 'img_thumbnail_small_03.png' },
            { label: '20260314',         file: 'img_thumbnail_small_04.png' },
          ].map((item) => (
            <div key={item.file} className="content-card">
              <div className="content-label">{item.label}</div>
              <img
                className="content-thumb"
                src={`/img/${item.file}`}
                alt={item.label}
              />
            </div>
          ))}
        </div>
      </main>

      {/* 딤 오버레이 */}
      {sidePanelOpen && (
        <div className="overlay overlay--open" onClick={onCloseSidePanel} />
      )}

      {/* 사이드 패널 */}
      <SidePanel
        open={sidePanelOpen}
        onAddAccount={() => {
          onCloseSidePanel()
          onNavigate('profile-type')
        }}
      />
    </div>
  )
}

// ─── 사이드 패널 (인라인) ────────────────────────────────────────────────────
type SidePanelProps = {
  open: boolean
  onAddAccount: () => void
}

function SidePanel({ open, onAddAccount }: SidePanelProps) {
  return (
    <aside className={`side-panel${open ? ' side-panel--open' : ''}`}>
      <div className="panel-header">
        <span className="panel-title">LG전자 계정</span>
        <button type="button" className="panel-more" aria-label="더보기">
          <svg viewBox="0 0 4 18" fill="currentColor">
            <circle cx={2} cy={2}  r={1.6} />
            <circle cx={2} cy={9}  r={1.6} />
            <circle cx={2} cy={16} r={1.6} />
          </svg>
        </button>
      </div>

      <ul className="account-list">
        {/* 삼삼오오 */}
        <li className="account-item">
          <div className="account-left">
            <div className="avatar av-purple">L</div>
            <span className="account-name">삼삼오오</span>
          </div>
          <div className="account-right">
            <div className="vdivider" />
            <button type="button" className="logout-btn" aria-label="로그아웃">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1={21} y1={12} x2={9} y2={12} />
              </svg>
            </button>
          </div>
        </li>
        {/* 키즈 */}
        <li className="account-item">
          <div className="account-left">
            <div className="avatar av-yellow">K</div>
            <span className="account-name">키즈</span>
          </div>
        </li>
        {/* 추가하기 */}
        <li className="account-item" onClick={onAddAccount} style={{ cursor: 'pointer' }}>
          <div className="account-left">
            <div className="avatar av-add">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2}
                strokeLinecap="round">
                <line x1={12} y1={5} x2={12} y2={19} />
                <line x1={5} y1={12} x2={19} y2={12} />
              </svg>
            </div>
            <span className="account-name">추가하기</span>
          </div>
        </li>
      </ul>
    </aside>
  )
}
