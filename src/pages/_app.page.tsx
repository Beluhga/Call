import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { globalStyles } from '../styles/globo'

globalStyles()

export default function App({ 
  Component,   
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (

  <SessionProvider session={session}>
  <Component {...pageProps} />
  </SessionProvider>
  )
}
