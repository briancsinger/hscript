import axios from 'axios';

const buildClient = ({ req }) => {
    let baseURL = 'http://www.singer.land';
    // if (process.env.NODE_ENV === 'development') {
    //     baseURL =
    //         'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
    // }

    if (typeof window === 'undefined') {
        return axios.create({
            baseURL,
            headers: req.headers,
        });
    }
    return axios.create({ baseURL: '/' });
};

export default buildClient;
