
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useChallenges } from './useChallenges';

// Routes to prefetch based on current route
const PREFETCH_MAP: Record<string, string[]> = {
  '/': ['/habits', '/challenges'],
  '/habits': ['/goals', '/journey'],
  '/challenges': ['/goals', '/journey'],
  '/goals': ['/habits', '/challenges'],
  '/journey': ['/habits', '/challenges'],
};

export function usePrefetch() {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const { userProfile } = useChallenges();
  
  const prefetchHabits = useCallback(async () => {
    // Check if we already have habits data
    const existingData = queryClient.getQueryData(['habits']);
    if (existingData) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // Prefetch habits data
    queryClient.prefetchQuery({
      queryKey: ['habits'],
      queryFn: async () => {
        const { data } = await supabase
          .from('habits')
          .select(`
            *,
            habit_categories (
              id,
              name,
              color,
              icon
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5); // Only prefetch initial set
        
        return data || [];
      },
      staleTime: 60000, // 1 minute
    });
  }, [queryClient]);
  
  const prefetchUserProfile = useCallback(async () => {
    // Skip if we already have profile data
    if (userProfile) return;
    
    queryClient.prefetchQuery({
      queryKey: ['user-profile'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        return data;
      },
      staleTime: 120000, // 2 minutes
    });
  }, [queryClient, userProfile]);
  
  // Detect if on iOS
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  
  useEffect(() => {
    // For iOS, be more conservative with prefetching
    if (isIOS) {
      // Only prefetch profile data on iOS
      const timer = setTimeout(() => {
        prefetchUserProfile();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    const routesToPrefetch = PREFETCH_MAP[pathname] || [];
    
    // Skip if no routes to prefetch
    if (routesToPrefetch.length === 0) return;
    
    // Stagger prefetching to not impact current page load
    const timer = setTimeout(() => {
      prefetchUserProfile();
      
      // If current route is homepage or habits, prefetch habits data
      if (pathname === '/' || pathname === '/habits') {
        prefetchHabits();
      }
    }, 2000); // Wait 2 seconds after page load
    
    return () => clearTimeout(timer);
  }, [pathname, prefetchHabits, prefetchUserProfile, isIOS]);
  
  return null;
}
