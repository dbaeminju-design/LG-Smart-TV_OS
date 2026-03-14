// 02_계정 추가_프로필 유형 선택하기
import type { ScreenId } from '../data/kidsProfileFlow'

type ProfileTypeScreenProps = {
  onNavigate: (screen: ScreenId) => void
}

export function ProfileTypeScreen({ onNavigate }: ProfileTypeScreenProps) {
  return (
    <div className="screen screen--dark screen--center">
      <div className="pt-content">
        <h1 className="pt-title">프로필 유형 선택하기</h1>
        <p className="pt-sub">일반 혹은 키즈 프로필을 선택할 수 있습니다.</p>
        <button type="button" className="pt-btn pt-btn--blue">
          일반 프로필
        </button>
        <button
          type="button"
          className="pt-btn pt-btn--yellow"
          onClick={() => onNavigate('login')}
        >
          키즈 프로필
        </button>
      </div>
    </div>
  )
}
