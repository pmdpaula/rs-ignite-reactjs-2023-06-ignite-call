// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar_url: string;
    // created_at: string;
  }
}
