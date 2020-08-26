import axios from 'axios';

export default ({ req }) => {
    console.log('------------------------------------');
    console.log(process.env.NODE_ENV);
    console.log('------------------------------------');
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

// export default ({ req }) => {
//     if (typeof window === 'undefined') {
//         return axios.create({
//             baseURL:
//                 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
//             headers: req.headers,
//         });
//     }
//     return axios.create({ baseURL: '/' });
// };
