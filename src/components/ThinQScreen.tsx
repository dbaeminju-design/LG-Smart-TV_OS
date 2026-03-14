// 03_ThinQ 홍보 (3초 자동 → done)
import { KidsTopNav } from './KidsTopNav'

export function ThinQScreen() {
  return (
    <div className="screen screen--kids">
      <KidsTopNav />
      <div className="kc" style={{ paddingTop: 80 }}>
        <h2 className="kc-title">이제 아이의 시청 습관을 ThinQ에서 확인하세요</h2>
        <p className="kc-sub">실시간으로 시청 시간을 확인하고 원격으로 제어할 수 있습니다.</p>
        <div className="thinq-row">
          {/* 폰 목업 */}
          <div className="phone-shell">
            <div className="phone-notch" />
            <div className="thinq-icon">
              <svg viewBox="0 0 44 44" fill="none">
                <rect x={4} y={4} width={36} height={36} rx={8} fill="#e53030" />
                <path d="M14 22 L22 14 L30 22" stroke="#fff" strokeWidth={2.5}
                  strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M22 14 L22 30" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
                <circle cx={22} cy={30} r={3} fill="#fff" />
              </svg>
            </div>
            <span className="thinq-name">ThinQ</span>
          </div>

          {/* QR 코드 */}
          <div style={{ textAlign: 'center' }}>
            <div className="qr-grid" />
            <p className="qr-label">ThinQ 다운로드 하러가기</p>
          </div>
        </div>
      </div>
      <div className="auto-bar running" />
    </div>
  )
}
