import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      profile: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      login: (token, profile) => {
        localStorage.setItem('tpip_token', token)
        set({ token, profile, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('tpip_token')
        set({ token: null, profile: null, isAuthenticated: false })
      },

      updateProfile: (profile) => set({ profile })
    }),
    {
      name: 'tpip-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)

export default useAuthStore
