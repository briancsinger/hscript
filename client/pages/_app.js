import 'fontsource-roboto';

import Head from 'next/head';
import buildClient from '../api/build-client';
import Header from '../component/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Head>
                <title>hscript</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <Header currentUser={currentUser} />
            <div className="container">
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
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
