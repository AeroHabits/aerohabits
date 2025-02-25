
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function TrialBanner() {
  const navigate = useNavigate();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('trial_end_date, is_subscribed')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (profile?.trial_end_date && !profile.is_subscribed) {
      const trialEnd = new Date(profile.trial_end_date);
      const now = new Date();
      const timeLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysLeft(timeLeft > 0 ? timeLeft : 0);
    }
  }, [profile]);

  if (!profile || profile.is_subscribed || daysLeft === null) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg z-50">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm font-medium">
            {daysLeft > 0 
              ? `${daysLeft} days left in your free trial`
              : 'Your free trial has expired'}
          </p>
        </div>
        <Button
          onClick={() => navigate('/premium')}
          className="bg-white text-purple-600 hover:bg-gray-100"
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  );
}
