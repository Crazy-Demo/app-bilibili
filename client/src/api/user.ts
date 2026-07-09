import apiClient from './client'
import type { UserProfile } from '../../../shared/types/user'

export const userApi = {
  getMe: () => apiClient.get<UserProfile>('/user/me'),
  getProfile: (uid: number) => apiClient.get<UserProfile>(`/user/${uid}/profile`),
  follow: (uid: number) => apiClient.post(`/user/${uid}/follow`),
}
