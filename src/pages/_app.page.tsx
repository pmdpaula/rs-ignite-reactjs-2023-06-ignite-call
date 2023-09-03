import './../lib/dayjs';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';

import { queryClient } from '../lib/react-query';
import { globalStyles } from '../styles/global';

globalStyles();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pr_BR',
            url: 'https://www.ignite-call.sem.endereco/',
            siteName: 'IgniteCall',
          }}
        />
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
