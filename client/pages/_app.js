import 'fontsource-roboto';

import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import buildClient from '../api/build-client';
import Header from '../component/header';
import theme from '../theme/theme';
import Dashboard from '../component/dashboard/dashboard';

const AppComponent = ({ Component, pageProps, currentUser, pathName }) => {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    // if there's no currentUser it means the user is logged out
    // so don't wrap the Component in the dashboard
    const renderComponent = () => {
        const component = (
            <Component currentUser={currentUser} {...pageProps} />
        );

        if (!currentUser) {
            return component;
        }

        return (
            <Dashboard currentUser={currentUser} pathName={pathName}>
                {component}
            </Dashboard>
        );
    };

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
                {renderComponent()}
            </ThemeProvider>
        </React.Fragment>
    );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
    const { pathname: pathName = '/' } = ctx;
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
        pathName,
        ...data,
    };
};

export default AppComponent;
