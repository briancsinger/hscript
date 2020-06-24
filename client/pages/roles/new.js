import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const NewRole = () => {
    const [name, setName] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/roles',
        method: 'post',
        body: {
            name,
        },
        onSuccess: (role) => {
            Router.push('/roles/[roleId]', `/roles/${role.id}`);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        doRequest();
    };

    return (
        <div>
            <h1>Create a Role</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                    />
                </div>
                {errors}
                <input type="submit" className="btn btn-primary" />
            </form>
        </div>
    );
};

NewRole.getInitialProps = async (context, client, currentUser) => {
    return { client };
};

export default NewRole;
