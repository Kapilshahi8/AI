import { AppProps } from 'next/app';
import React from 'react';
// import 'bootstrap/dist/css/bootstrap.css'
import './styles/emailTemplate.css'
import './styles/form.css'
import './styles/globals.css'


function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
