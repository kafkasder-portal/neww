import { useMutation } from '@tanstack/react-query'
import { createDemoAccount } from '../api/userManagement'
import { toast } from 'sonner'
import { useAuthStore } from '../store/auth'

export function useCreateDemoAccount() {
  const { signIn } = useAuthStore()

  return useMutation({
    mutationFn: createDemoAccount,
    onSuccess: async (data) => {
      toast.success(
        `Demo hesabı oluşturuldu!\n` +
        `Email: ${data.email}\n` +
        `Şifre: ${data.password}\n` +
        `Rol: ${data.profile.role}`,
        {
          duration: 10000, // 10 saniye göster
          action: {
            label: 'Giriş Yap',
            onClick: async () => {
              try {
                await signIn(data.email, data.password)
                toast.success('Demo hesabıyla giriş yapıldı!')
              } catch (_error) {
                toast.error('Giriş yapılamadı')
              }
            }
          }
        }
      )
    },
    onError: (error) => {
      toast.error(`Demo hesabı oluşturulamadı: ${error.message}`)
    }
  })
}

export function useDemoAccountActions() {
  const createDemo = useCreateDemoAccount()

  const createAndLogin = async () => {
    const result = await createDemo.mutateAsync()
    // Otomatik giriş yap
    const { signIn } = useAuthStore.getState()
    await signIn(result.email, result.password)
    return result
  }

  return {
    createDemo: createDemo.mutate,
    createAndLogin,
    isLoading: createDemo.isPending,
    error: createDemo.error
  }
}