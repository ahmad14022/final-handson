// pages/_app.js
import { ToastProvider } from '@/context/ToastContext';
import '@/styles/globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400',
});

export default function MyApp({ Component, pageProps }: any) {
  return (
    <ToastProvider>
      <div className={poppins.className}>
        <Component {...pageProps} />
      </div>
    </ToastProvider>
  );
}
