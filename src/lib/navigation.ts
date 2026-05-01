export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  MYPAGE: '/mypage',
  UPLOAD: '/upload',
  PROMPT_DETAIL: (id: string | number) => `/prompt/${id}`,
  PROFILE_EDIT: '/mypage/edit',
}

export const navigationUtils = {
  confirmAndBack: (router: any) => {
    if (
      confirm('작성 중인 내용이 저장되지 않을 수 있습니다. 뒤로 가시겠습니까?')
    ) {
      router.back()
    }
  },
  moveToUpload: (router: any) => {
    router.push(ROUTES.UPLOAD)
  },
  moveToHome: (router: any) => {
    router.push(ROUTES.HOME)
  },
  moveToLogin: (router: any) => {
    router.push(ROUTES.LOGIN)
  },
  moveToMyPage: (router: any) => {
    router.push(ROUTES.MYPAGE)
  },
  moveToPromptDetail: (router: any, id: string | number) => {
    router.push(ROUTES.PROMPT_DETAIL(id))
  },
}
