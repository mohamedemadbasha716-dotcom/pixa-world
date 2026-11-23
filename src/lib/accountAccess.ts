import { supabase } from './supabase';

export async function currentAccountId(): Promise<string | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  return !error && user && !user.is_anonymous && user.email_confirmed_at ? user.id : null;
}

export async function isPlatformOwner(): Promise<boolean> {
  if (!await currentAccountId()) return false;
  const { data, error } = await supabase.rpc('pixa_is_owner');
  return !error && data === true;
}

export function activeSubscription(subscription: { is_active?: boolean; plan_type?: string; started_at?: string; expires_at?: string | null } | null, now = Date.now()): boolean {
  if (!subscription?.is_active || !['monthly', 'quarterly', 'yearly'].includes(subscription.plan_type || '')) return false;
  if (subscription.started_at && (!Number.isFinite(Date.parse(subscription.started_at)) || Date.parse(subscription.started_at) > now)) return false;
  return !subscription.expires_at || (Number.isFinite(Date.parse(subscription.expires_at)) && Date.parse(subscription.expires_at) > now);
}
