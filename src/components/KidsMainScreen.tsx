// 04_키즈 프로필 메인화면 – 노란 배경 TV 홈
export function KidsMainScreen() {
  return (
    <div className="screen screen--kids-main">
      <nav className="side-nav side-nav--kids">
        <button type="button" className="btn-profile bp-yellow" aria-label="키즈 프로필">
          K
        </button>
        <div className="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth={1.6}
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div className="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth={1.6}
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx={12} cy={12} r={3} />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
        <div className="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth={1.6}
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
        </div>
      </nav>

      <main className="tv-main tv-main--kids">
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
              <div className="content-label content-label--kids">{item.label}</div>
              <img
                className="content-thumb"
                src={`/img/${item.file}`}
                alt={item.label}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
