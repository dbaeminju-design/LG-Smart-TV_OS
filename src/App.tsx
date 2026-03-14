import { useState, useEffect, useCallback } from 'react'
import './App.css'

import type { ScreenId } from './data/kidsProfileFlow'
import { AUTO_ADVANCE, AUTO_ADVANCE_DELAY_MS } from './data/kidsProfileFlow'

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('main')
  const [sidePanelOpen, setSidePanelOpen] = useState(false)

  const navigate = useCallback((screen: ScreenId) => {
    setCurrentScreen(screen)
  }, [])

  // 3초 자동 전환 처리
  useEffect(() => {
    const nextScreen = AUTO_ADVANCE[currentScreen]
    if (!nextScreen) return

    const timer = setTimeout(() => {
      setCurrentScreen(nextScreen)
    }, AUTO_ADVANCE_DELAY_MS)

    return () => clearTimeout(timer)
  }, [currentScreen])

  // 각 스크린 컴포넌트는 `.screen` 클래스를 루트에 가지므로,
  // activeScreenId와 일치할 때만 렌더링하여 `display: flex` 상태를 유지합니다.
  // MainScreen은 항상 렌더링되고 내부 side-panel을 통해 흐름을 시작합니다.
  return (
    <>
      {/* 01_main – 항상 렌더링. 다른 화면이 fixed로 덮음 */}
      <MainScreen
        onNavigate={navigate}
        sidePanelOpen={sidePanelOpen}
        onToggleSidePanel={() => setSidePanelOpen((v) => !v)}
        onCloseSidePanel={() => setSidePanelOpen(false)}
      />

      {currentScreen === 'profile-type' && (
        <ProfileTypeScreen onNavigate={navigate} />
      )}

      {currentScreen === 'login' && <LoginScreen />}

      {currentScreen === 'connected' && <ConnectedScreen />}

      {currentScreen === 'content' && (
        <ContentEnvScreen onNavigate={navigate} />
      )}

      {currentScreen === 'time' && (
        <WatchTimeScreen onNavigate={navigate} />
      )}

      {currentScreen === 'interest' && (
        <InterestScreen onNavigate={navigate} />
      )}

      {currentScreen === 'cam-before' && (
        <SmartCamBeforeScreen onNavigate={navigate} />
      )}

      {currentScreen === 'cam-connecting' && <SmartCamConnectingScreen />}

      {currentScreen === 'cam-after' && (
        <SmartCamAfterScreen onNavigate={navigate} />
      )}

      {currentScreen === 'thinq' && <ThinQScreen />}

      {currentScreen === 'done' && <CreationCompleteScreen />}

      {currentScreen === 'kids-main' && <KidsMainScreen />}
    </>
  )
}
