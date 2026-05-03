export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  MYPAGE: '/mypage',
  UPLOAD: '/upload',
}

export const navigationUtils = {
  moveToUpload: (router: any) => {
    router.push(ROUTES.UPLOAD)
  },
  moveToLogin: (router: any) => {
    router.push(ROUTES.LOGIN)
  },
  moveToMyPage: (router: any) => {
    router.push(ROUTES.MYPAGE)
  },
}
