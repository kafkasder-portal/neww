import { User } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      file?: any;
    }

    interface Session {
      csrfToken?: string;
    }
  }
}

export {};
