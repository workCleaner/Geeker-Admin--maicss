import http from '@/utils/request'
import { SERVER_ENDPOINTS } from '@/constants'

interface UserInfo {
  id: string
  username: string
  email: string
  phone: string
  avatar: string
}
interface ResAuthButtons {
  [key: string]: string[]
}
interface MenuOptions {
  path: string
  name: string
  component: string
  meta: {
    icon: string
    title: string
    isLink: string
    isHide: boolean
    isFull: boolean
    isAffix: boolean
    isKeepAlive: boolean
  }
  children?: MenuOptions[]
}
export const AccountAPI = {
  getUserInfo: () =>
    http.get<UserInfo>(SERVER_ENDPOINTS.api + `/user/info?userCode=${localStorage.getItem('userCode')}`),
  getUserMenu: () =>
    http.get<MenuOptions[]>(SERVER_ENDPOINTS.api + `/user/menu?userCode=${localStorage.getItem('userCode')}`),
  getUserButtons: () =>
    http.get<ResAuthButtons>(SERVER_ENDPOINTS.api + `/user/buttons?userCode=${localStorage.getItem('userCode')}`),
}
