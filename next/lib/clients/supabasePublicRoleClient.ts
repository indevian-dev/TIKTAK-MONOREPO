/**
 * @deprecated STUB — Supabase JS client removed. Migrate to API routes or pgsql client.
 * This file exists only to prevent build errors. All methods throw at runtime.
 */

const MIGRATION_MSG = '[MIGRATION NEEDED] supabasePublicRoleClient is removed. Use API routes instead.';

const throwingProxy = new Proxy({}, {
  get(_target, prop) {
    if (prop === 'then' || prop === 'catch' || typeof prop === 'symbol') return undefined;
    // Return a function that returns another proxy (for chaining: supabase.from('x').select('*'))
    return (..._args: unknown[]) => {
      console.warn(MIGRATION_MSG, '- called:', String(prop));
      return new Proxy(Promise.resolve({ data: null, error: new Error(MIGRATION_MSG) }), {
        get(target, innerProp) {
          if (innerProp === 'then' || innerProp === 'catch' || innerProp === 'finally') {
            return (target as any)[innerProp].bind(target);
          }
          return (..._innerArgs: unknown[]) => target;
        }
      });
    };
  }
});

export default throwingProxy;
