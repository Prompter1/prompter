/**
 * KG 이니시스 결제 유틸리티
 *
 * 표준결제창 (PC/Mobile 자동 분기)
 * 신용카드 고정 노출 (payViewType: 'card')
 */
import crypto from 'crypto'

// ─── 환경변수 ──────────────────────────────────────────────────────────────────
export const INICIS_MID = process.env.INICIS_MID! // 상점 아이디 (예: INIpayTest)
export const INICIS_API_KEY = process.env.INICIS_API_KEY! // 웹표준결제 API Key
export const INICIS_IV = process.env.INICIS_IV! // 웹표준결제 IV
export const INICIS_SIGN_KEY = process.env.INICIS_SIGN_KEY! // 서명용 키

// 실 운영: 'https://stdpay.inicis.com/stdjs/INIStdPay.js'
// 심사·테스트: 'https://stgstdpay.inicis.com/stdjs/INIStdPay.js'
export const INICIS_SCRIPT_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://stdpay.inicis.com/stdjs/INIStdPay.js'
    : 'https://stgstdpay.inicis.com/stdjs/INIStdPay.js'

export const INICIS_PAY_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://stdpay.inicis.com/api/payRequest'
    : 'https://stgstdpay.inicis.com/api/payRequest'

// 모바일 결제 URL
export const INICIS_MOBILE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://mobile.inicis.com/smart/payment/'
    : 'https://tmobile.inicis.com/smart/payment/'

// ─── 주문번호 생성 ──────────────────────────────────────────────────────────────
export function generateOrderId(prefix = 'order'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}-${random}`
}

// ─── SHA-256 해시 ──────────────────────────────────────────────────────────────
export function sha256(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex')
}

// ─── 타임스탬프 (yyyyMMddHHmmss) ───────────────────────────────────────────────
export function getTimestamp(): string {
  const now = new Date()
  return (
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
  )
}

/**
 * 결제창 서명값 생성
 * signKey + timestamp + mid + oid + price 조합 SHA-256
 */
export function createSignature(params: {
  timestamp: string
  mid: string
  oid: string
  price: number
}): string {
  const raw = `oid=${params.oid}&price=${params.price}&timestamp=${params.timestamp}`
  return sha256(raw)
}

/**
 * 검증용 mKey 생성
 * SHA-256(signKey)
 */
export function createMKey(): string {
  return sha256(INICIS_SIGN_KEY)
}

/**
 * 결제 승인 요청 (서버→이니시스)
 * authToken + authUrl 로 승인
 */
export async function confirmInicisPayment(params: {
  authToken: string
  authUrl: string
  netCancelUrl: string
  timestamp: string
  charset: string
  format: string
}): Promise<InicisApproveResult> {
  const { authToken, authUrl, timestamp, charset, format } = params

  const body = new URLSearchParams({
    P_TID: authToken,
    P_MID: INICIS_MID,
  })

  const res = await fetch(authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const text = await res.text()

  // format이 JSON인 경우
  if (format === 'JSON') {
    return JSON.parse(text) as InicisApproveResult
  }

  // 기본: querystring 형태 파싱
  const result: Record<string, string> = {}
  for (const pair of text.split('&')) {
    const [k, v] = pair.split('=')
    if (k) result[decodeURIComponent(k)] = decodeURIComponent(v ?? '')
  }
  return result as unknown as InicisApproveResult
}

export interface InicisApproveResult {
  resultCode: string // '0000' = 성공
  resultMsg: string
  tid: string // 이니시스 거래번호
  MOID: string // 주문번호
  TotPrice: string // 결제금액
  goodName: string
  payMethod: string
  applDate?: string
  applTime?: string
  applNum?: string // 카드 승인번호
  cardName?: string // 카드사명
  cardNum?: string // 카드번호 (마스킹)
  [key: string]: string | undefined
}
