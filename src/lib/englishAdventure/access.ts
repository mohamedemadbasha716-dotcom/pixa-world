/** Independent English access policy. No client-side flags or user_metadata role grants. */
export const ENGLISH_ADVENTURE_LESSONS = ['hello','numbers','family','colours','body'] as const;
export type AdventureLesson = typeof ENGLISH_ADVENTURE_LESSONS[number];
export interface VerifiedActor { id: string; isAdmin: boolean }
export interface ProgressRecord { lesson_id: string; completed: boolean }
export type AccessResult = { allowed: true } | { allowed: false; reason: 'unauthenticated' | 'unknown_lesson' | 'locked_sequence' };
export function lessonAccess(actor: VerifiedActor | null, lesson: string, progress: ProgressRecord[]): AccessResult {
  if (!actor) return {allowed:false,reason:'unauthenticated'};
  const ix = ENGLISH_ADVENTURE_LESSONS.indexOf(lesson as AdventureLesson);
  if (ix < 0) return {allowed:false,reason:'unknown_lesson'};
  if (actor.isAdmin || ix===0) return {allowed:true};
  const completed = new Set(progress.filter(p=>p.completed).map(p=>p.lesson_id));
  return ENGLISH_ADVENTURE_LESSONS.slice(0,ix).every(id=>completed.has(id))
    ? {allowed:true} : {allowed:false,reason:'locked_sequence'};
}
/** Must only consume a user returned by Supabase auth.getUser on the server.
 * Admin UUIDs are deployment configuration, set only after owner binding verification.
 * Never derive privileges from localStorage, request body, editable user_metadata or a mock.
 */
export function verifiedActor(user: {id:string}|null, verifiedAdminIds: ReadonlySet<string>): VerifiedActor | null {
  return user ? {id:user.id,isAdmin:verifiedAdminIds.has(user.id)} : null;
}
