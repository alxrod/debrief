
import store from '../store'
import { Provider } from 'react-redux'
import '../styles/globals.css'
import AppWrapper from "../components/app_wrapper";
import Navbar from "../components/navbar";
import Head from 'next/head';

const App = ({Component, pageProps}) => {
  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href={process.env.NEXT_PUBLIC_FRONTEND_URL+"/favicon.ico"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <link rel="apple-touch-icon" href={process.env.NEXT_PUBLIC_FRONTEND_URL+"/logo192.png"} />

        <link rel="manifest" href={"/manifest.json"}/>

        <title>Debrief</title>
      </Head>
      <Provider store={store}>
        <AppWrapper>
          <Navbar/>
          <Component {...pageProps}/>
        </AppWrapper>
      </Provider>
    </div>
  )
}

export default App
