import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(roles?: string[]) {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) router.replace('/login');
    else if (roles && !roles.includes(JSON.parse(user).rol)) router.replace('/');
  }, [router, roles]);
}
