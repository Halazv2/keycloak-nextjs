import '../styles/globals.css'
import '../styles/index.css'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import cookie from 'cookie'
import * as React from 'react'
import type { IncomingMessage } from 'http' //  i used this to get the cookies from the request
import type { AppProps, AppContext } from 'next/app' // i use app
import { SSRKeycloakProvider, SSRCookies } from '@react-keycloak/ssr' // provides SSR context for keycloak because it's not available in the client
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
      init={true}
      initOnSSR={true}
      initOptions={{
        onLoad: 'check-state',
        checkLoginIframe: false,
        checkLoginIframeInterval: 5,
        token: cookies.token,
        refreshToken: cookies.refreshToken,
        idToken: cookies.idToken,
        expiresIn: cookies.expiresIn,
        scope: cookies.scope,
        timeStamp: cookies.timeStamp,
        nonce: cookies.nonce,
        state: cookies.state,
        code: cookies.code,
        redirectUri: cookies.redirectUri,
        responseMode: cookies.responseMode,
        responseType: cookies.responseType,
        flow: cookies.flow,
        display: cookies.display,
        locale: cookies.locale,
        action: cookies.action,
        uid: cookies.uid,
        username: cookies.username,
        email: cookies.email,
        firstName: cookies.firstName,
        lastName: cookies.lastName,
        preferredUsername: cookies.preferredUsername,
        name: cookies.name,
        picture: cookies.picture,
        givenName: cookies.givenName,
        familyName: cookies.familyName,
        middleName: cookies.middleName,
        nickname: cookies.nickname,
        profile: cookies.profile,
        website: cookies.we
      }}
  
    >
      <Component {...pageProps} />
    </SSRKeycloakProvider>
  
  )

}
function parseCookies(req?: IncomingMessage) { // IncomingMessage for 
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
