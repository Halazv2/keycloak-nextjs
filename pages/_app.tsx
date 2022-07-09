import '../styles/globals.css'
import '../styles/index.css'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import cookie from 'cookie'
import * as React from 'react'
import type { IncomingMessage } from 'http'
import type { AppProps, AppContext } from 'next/app'
import { SSRKeycloakProvider, SSRCookies } from '@react-keycloak/ssr'

const KeycloakConfig = {
  realm: "fm6",// name of the realm
  url: "https://keycloaktest.ayouris.net/auth",// url of the Keycloak server
  clientId: "sga-front", // clientId of the application
}
interface InitialProps {
  cookies: unknown
}
function MyApp({ Component, pageProps, cookies }: AppProps & InitialProps) {


  return (
    <SSRKeycloakProvider
      keycloakConfig={KeycloakConfig}
      persistor={SSRCookies(cookies)}
      
    >
      <Component {...pageProps} />
    </SSRKeycloakProvider>
  
  )

}
function parseCookies(req?: IncomingMessage) {
  if (req) {
    return cookie.parse(req.headers.cookie || '')
  }
  return {}
}
MyApp.getInitialProps = async (appContext: AppContext) => {
  // Extract cookies from the request
  return { cookies: parseCookies(appContext?.ctx?.req) }
}

export default MyApp
