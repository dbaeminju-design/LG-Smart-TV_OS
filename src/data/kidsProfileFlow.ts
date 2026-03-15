// ─── 화면 ID 타입 ────────────────────────────────────────────────────────────
export type ScreenId =
  | 'profile-select'    // 00_프로필 선택 (첫 화면)
  | 'main'              // 01_main (부모 모드 홈)
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
  | 'profile-create'    // 새 자녀 프로필 인터랙티브 생성 폼
  | 'settings'          // 설정 메인
  | 'settings-child'    // 자녀 보호 설정
  | 'pin'               // 어른 모드 전환 PIN 입력

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

// ─── 키즈 홈 콘텐츠 데이터 ──────────────────────────────────────────────────
export interface KidsCategory {
  id: string
  label: string
  emoji: string
  color: string
}

export const KIDS_CATEGORIES: KidsCategory[] = [
  { id: 'home',    label: '추천 홈',   emoji: '🐻', color: '#FF8C42' },
  { id: 'percent', label: '월정액',    emoji: '%',  color: '#E879A0' },
  { id: 'english', label: '신나는 영어', emoji: 'AB', color: '#5B9BD5' },
  { id: 'nuree',   label: '자라는 누리', emoji: '학', color: '#7DC67E' },
  { id: 'books',   label: '꿈꾸는 독서', emoji: '책', color: '#F5A623' },
  { id: 'songs',   label: '즐거운 동요', emoji: '음', color: '#9B87D4' },
  { id: 'char',    label: '캐릭터 친구', emoji: '낭', color: '#F06292' },
]

export interface KidsContent {
  id: string
  title: string
  sub: string
  color: string
  badge?: string
}

export const KIDS_CONTENTS: KidsContent[] = [
  { id: 'c1', title: '한글용사 아이아', sub: '무료 인기작',  color: '#F5C842', badge: '무료' },
  { id: 'c2', title: '넘버 블록스',     sub: '한국어',       color: '#6DB8F0' },
  { id: 'c3', title: '코코멜론',        sub: '가족동요',     color: '#8ED6D6' },
  { id: 'c4', title: '엉뚱발랄 콩순이', sub: '친구들',       color: '#F09090' },
  { id: 'c5', title: '꼬모록',          sub: '요리 놀이',    color: '#C8C8C8' },
  { id: 'c6', title: '최강 전사 미니특공대', sub: '액션',    color: '#3A4A6B' },
]
