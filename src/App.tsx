import { useState, useEffect, useCallback } from 'react'
import './App.css'

import type { ScreenId } from './data/kidsProfileFlow'
import { AUTO_ADVANCE, AUTO_ADVANCE_DELAY_MS } from './data/kidsProfileFlow'
import { DEFAULT_PROFILES, getThemeByAge } from './data/profiles'
import type { ChildProfile } from './data/profiles'

import { MainScreen }               from './components/MainScreen'
import { ProfileTypeScreen }        from './components/ProfileTypeScreen'
import { LoginScreen }              from './components/LoginScreen'
import { ConnectedScreen }          from './components/ConnectedScreen'
import { ContentEnvScreen }         from './components/ContentEnvScreen'
import { WatchTimeScreen }          from './components/WatchTimeScreen'
import { InterestScreen }           from './components/InterestScreen'
import { SmartCamBeforeScreen }     from './components/SmartCamBeforeScreen'
import { SmartCamConnectingScreen } from './components/SmartCamConnectingScreen'
import { SmartCamAfterScreen }      from './components/SmartCamAfterScreen'
import { ThinQScreen }              from './components/ThinQScreen'
import { CreationCompleteScreen }   from './components/CreationCompleteScreen'
import { KidsMainScreen }           from './components/KidsMainScreen'
import { MainSettingsLayout }       from './components/MainSettingsLayout'
import { ProfileCreateFormScreen }  from './components/ProfileCreateFormScreen'
import { PinScreen }               from './components/PinScreen'

export { getThemeByAge }
export type { ChildProfile }

// ─── 프로필 모드 – 어른/키즈 글로벌 테마 제어 ─────────────────────────────
export type ProfileMode = 'adult' | 'kids'

export default function App() {
  const [currentScreen, setCurrentScreen]     = useState<ScreenId>('main')
  const [profiles, setProfiles]               = useState<ChildProfile[]>([...DEFAULT_PROFILES])
  const [activeProfileId, setActiveProfileId] = useState<string>(DEFAULT_PROFILES[0].id)
  const [sharedMode, setSharedMode]           = useState(false)
  const [profileMode, setProfileMode]         = useState<ProfileMode>('adult')

  const navigate = useCallback((screen: ScreenId) => {
    setCurrentScreen(screen)
  }, [])

  // 3초 자동 전환
  useEffect(() => {
    const nextScreen = AUTO_ADVANCE[currentScreen]
    if (!nextScreen) return
    const timer = setTimeout(() => setCurrentScreen(nextScreen), AUTO_ADVANCE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [currentScreen])

  // 프로필 모드 자동 동기화 (화면 기반)
  useEffect(() => {
    if (currentScreen === 'kids-main') setProfileMode('kids')
    else if (currentScreen === 'main') setProfileMode('adult')
  }, [currentScreen])

  // 키즈 프로필 선택 핸들러 (메인화면 계정패널 → 키즈홈)
  const handleSelectKidsProfile = (profileId: string) => {
    setActiveProfileId(profileId)
    setProfileMode('kids')
  }

  const updateTimeLimit = (profileId: string, minutes: number) => {
    setProfiles(prev => prev.map(p =>
      p.id === profileId ? { ...p, timeLimit: minutes } : p
    ))
  }

  const addProfile = (newProfile: ChildProfile) => {
    setProfiles(prev => [...prev, newProfile])
    setActiveProfileId(newProfile.id)
    setProfileMode('kids')
  }

  // 글로벌 테마 CSS 변수 – 키즈 모드에서 active 자녀 색상 주입
  const activeKidsProfile = profiles.find(p => p.id === activeProfileId)
  const kidsTheme = activeKidsProfile ? getThemeByAge(activeKidsProfile.age) : null
  const themeVars = profileMode === 'kids' && kidsTheme ? {
    '--theme-accent':  kidsTheme.accent,
    '--theme-bg':      kidsTheme.bgColor,
    '--theme-text':    kidsTheme.textColor,
  } as React.CSSProperties : {}

  return (
    <div
      data-profile-mode={profileMode}
      style={themeVars}
      className="app-root"
    >
      {/* 01_main – 어른 모드 홈 */}
      {currentScreen === 'main' && (
        <MainScreen
          onNavigate={navigate}
          profiles={profiles}
          activeProfileId={activeProfileId}
          onSelectKidsProfile={handleSelectKidsProfile}
        />
      )}

      {currentScreen === 'profile-type' && (
        <ProfileTypeScreen onNavigate={navigate} />
      )}
      {currentScreen === 'login'         && <LoginScreen />}
      {currentScreen === 'connected'     && <ConnectedScreen />}
      {currentScreen === 'content'       && <ContentEnvScreen  onNavigate={navigate} />}
      {currentScreen === 'time'          && <WatchTimeScreen   onNavigate={navigate} />}
      {currentScreen === 'interest'      && <InterestScreen    onNavigate={navigate} />}
      {currentScreen === 'cam-before'    && <SmartCamBeforeScreen     onNavigate={navigate} />}
      {currentScreen === 'cam-connecting'&& <SmartCamConnectingScreen />}
      {currentScreen === 'cam-after'     && <SmartCamAfterScreen      onNavigate={navigate} />}
      {currentScreen === 'thinq'         && <ThinQScreen />}
      {currentScreen === 'done'          && <CreationCompleteScreen   onNavigate={navigate} />}

      {/* profile-create – 키즈 프로필 생성 폼 */}
      {currentScreen === 'profile-create' && (
        <ProfileCreateFormScreen
          onNavigate={navigate}
          onAddProfile={addProfile}
        />
      )}

      {/* 04_kids-main */}
      {currentScreen === 'kids-main' && (
        <KidsMainScreen
          onNavigate={navigate}
          profiles={profiles}
          activeProfileId={activeProfileId}
          onSwitchProfile={(id) => { setActiveProfileId(id); setProfileMode('kids') }}
          sharedMode={sharedMode}
          onToggleSharedMode={() => setSharedMode(v => !v)}
          onUpdateTimeLimit={updateTimeLimit}
        />
      )}

      {/* PIN 입력 – 키즈 → 어른 전환 */}
      {currentScreen === 'pin' && (
        <PinScreen
          onNavigate={navigate}
          onSuccess={() => { setProfileMode('adult'); navigate('main') }}
          onCancel={() => navigate('kids-main')}
        />
      )}

      {(currentScreen === 'settings' || currentScreen === 'settings-child') && (
        <MainSettingsLayout
          onBack={() => navigate(profileMode === 'kids' ? 'kids-main' : 'main')}
          profiles={profiles}
          activeProfileId={activeProfileId}
          onUpdateTimeLimit={updateTimeLimit}
          initialSection={currentScreen === 'settings-child' ? 'family' : 'network'}
        />
      )}
    </div>
  )
}
