import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

export default () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: { email, password, name },
        onSuccess: () => Router.push('/'),
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        await doRequest();
    };
    return (
        <form onSubmit={onSubmit}>
            <h1>SignUp</h1>
            <div className="form-group">
                <label>Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    );
};
