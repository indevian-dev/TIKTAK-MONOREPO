'use client'

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import { useRouter }
  from 'next/navigation'
import { apiFetchHelper }
  from '@/lib/helpers/apiCallForSpaHelper'
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide'

export default function AuthLogoutButtonWidget() {
  const { t } = loadClientSideCoLocatedTranslations('AuthLogoutButtonWidget')
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Call the API route to clear cookies server-side using handleApiCall
      await apiFetchHelper({
        method: 'POST',
        url: '/api/auth/logout'
      })

      // Redirect to login page
      router.push('/auth/login')
      router.refresh() // Refresh to ensure all server components update
    } catch (error) {
      ConsoleLogger.error('Logout failed:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
    >
      {t('logout_button')}
    </button>
  )
}