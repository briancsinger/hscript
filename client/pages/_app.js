import 'fontsource-roboto';

import React from 'react';
import Head from 'next/head';
import buildClient from '../api/build-client';
import Header from '../component/header';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme/theme';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>hscript</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component currentUser={currentUser} {...pageProps} />
            </ThemeProvider>
        </React.Fragment>
    );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
    const client = buildClient(ctx);
    const { data } = await client.get('/api/users/currentuser');

    let pageProps;
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(
            ctx,
            client,
            data.currentUser,
        );
    }

    return {
        pageProps,
        ...data,
    };
};

export default AppComponent;
