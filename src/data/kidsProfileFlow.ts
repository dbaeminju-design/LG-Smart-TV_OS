// ─── 화면 ID 타입 ────────────────────────────────────────────────────────────
export type ScreenId =
  | 'main'              // 01_main
  | 'profile-type'      // 02_계정 추가_프로필 유형 선택하기
  | 'login'             // 03_로그인 방법 선택하기         (3초 자동)
  | 'connected'         // 03_계정 연결 완료 알림          (3초 자동)
  | 'content'           // 03_콘텐츠 환경 선택
  | 'time'              // 03_시청 시간 설정
  | 'interest'          // 03_관심사 설정
  | 'cam-before'        // 03_스마트캠 연결전
  | 'cam-connecting'    // 03_스마트캠 연결중              (3초 자동)
  | 'cam-after'         // 03_스마트캠 연결후
  | 'thinq'             // 03_ThinQ 홍보                   (3초 자동)
  | 'done'              // 03_생성완료                      (3초 자동)
  | 'kids-main'         // 04_키즈 프로필 메인화면

// 3초 뒤 자동으로 다음 화면으로 이동하는 화면 목록
export const AUTO_ADVANCE: Partial<Record<ScreenId, ScreenId>> = {
  'login':          'connected',
  'connected':      'content',
  'cam-connecting': 'cam-after',
  'thinq':          'done',
  'done':           'kids-main',
}

export const AUTO_ADVANCE_DELAY_MS = 3000

// ─── 콘텐츠 환경 선택 카드 ────────────────────────────────────────────────────
export interface ContentCard {
  id: string
  label: string
  sub: string
}

export const CONTENT_CARDS: ContentCard[] = [
  { id: 'infant',   label: '유아 및 미취학 아동', sub: '만 4세 이하' },
  { id: 'lower',    label: '저학년 아동',          sub: '만 5-8세'   },
  { id: 'upper',    label: '고학년 아동',           sub: '만 9-12세'  },
]

// ─── 시청 시간 설정 카드 ──────────────────────────────────────────────────────
export interface TimeCard {
  id: string
  label: string
  recommended?: boolean
}

export const TIME_CARDS: TimeCard[] = [
  { id: '30min',  label: '30분'        },
  { id: '1hr',    label: '1시간',   recommended: true },
  { id: '1hr30',  label: '1시간 30분' },
  { id: 'custom', label: '직접 설정하기' },
]

// ─── 관심사 설정 카드 ─────────────────────────────────────────────────────────
export interface InterestCard {
  id: string
  label: string
}

export const INTEREST_CARDS: InterestCard[] = [
  { id: 'songs',   label: '동요'   },
  { id: 'habits',  label: '생활습관' },
  { id: 'arts',    label: '놀이예술' },
  { id: 'speech',  label: '말배우기' },
]

// ─── 계정 목록 (사이드 패널) ──────────────────────────────────────────────────
export interface Account {
  id: string
  label: string
  avatarChar: string
  variant: 'purple' | 'yellow' | 'add'
}

export const ACCOUNTS: Account[] = [
  { id: 'user1', label: '삼삼오오',  avatarChar: 'L', variant: 'purple' },
  { id: 'kids',  label: '키즈',      avatarChar: 'K', variant: 'yellow' },
  { id: 'add',   label: '추가하기',  avatarChar: '+', variant: 'add'    },
]
