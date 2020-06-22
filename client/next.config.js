module.export = {
    webpackDevMiddleware: (config) => {
        congif.watchOptions.poll = 300;
        return config;
    },
};
