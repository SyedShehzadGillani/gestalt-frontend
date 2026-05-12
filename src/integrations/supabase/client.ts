// Stubbed for v1: no real Supabase wiring. Preserves API surface so consumers don't crash.
const okEmpty = () => Promise.resolve({ data: null, error: null });
const subscription = { unsubscribe() {} };

const queryBuilder: any = {
  select: () => queryBuilder,
  insert: (_rows: any) => okEmpty(),
  update: (_patch: any) => queryBuilder,
  upsert: (_rows: any) => queryBuilder,
  delete: () => queryBuilder,
  eq: () => queryBuilder,
  neq: () => queryBuilder,
  gt: () => queryBuilder,
  lt: () => queryBuilder,
  gte: () => queryBuilder,
  lte: () => queryBuilder,
  like: () => queryBuilder,
  ilike: () => queryBuilder,
  in: () => queryBuilder,
  order: () => queryBuilder,
  limit: () => queryBuilder,
  range: () => queryBuilder,
  maybeSingle: okEmpty,
  single: okEmpty,
  then: (resolve: any) => resolve({ data: [], error: null }),
};

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: (_cb: any) => ({ data: { subscription } }),
    signInWithPassword: (_args: any) => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signUp: (_args: any) => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: (_table: string) => queryBuilder,
  functions: {
    invoke: async (name: string, _opts: any) => {
      if (name === "generate-onboarding") {
        return { data: { onboarding: { sections: [] } }, error: null };
      }
      if (name === "generate-definition") {
        return { data: { definition: "" }, error: null };
      }
      return { data: null, error: null };
    },
  },
  channel: (_name: string) => ({
    on: () => ({ subscribe: () => subscription }),
    subscribe: () => subscription,
  }),
  removeChannel: (_ch: any) => {},
} as any;
