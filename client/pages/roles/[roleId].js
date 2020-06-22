import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import useRequest from '../../hooks/use-request';

const RoleShow = ({ currentUser, role, scripts }) => {
    const [scriptName, setScriptName] = useState('');
    const { doRequest, errors } = useRequest({
        url: `/api/roles/${role.id}/scripts`,
        method: 'post',
        body: {
            name: scriptName,
        },
        onSuccess: (script) => {
            Router.push(
                '/roles/[roleId]/scripts/[scriptId]',
                `roles/${role.id}/scripts/${script.id}`,
            );
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        doRequest();
    };

    const scriptList = scripts.map((script) => {
        return (
            <tr key={script.id}>
                <td>{script.name}</td>
                <td>
                    <Link
                        href="roles/[roleId]/scripts/[scriptId]"
                        as={`roles/${role.id}/scripts/${script.id}`}
                    >
                        <a>Details</a>
                    </Link>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <h1>{role.name}</h1>

            <div>
                <h2>Scripts</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>{scriptList}</tbody>
                </table>
            </div>

            <div>
                <h1>Create a Script</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Script name</label>
                        <input
                            value={scriptName}
                            onChange={(e) => setScriptName(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    {errors}
                    <input type="submit" className="btn btn-primary" />
                </form>
            </div>
        </div>
    );
};

RoleShow.getInitialProps = async (context, client) => {
    const { roleId } = context.query;
    const { data: roleData } = await client.get(`/api/roles/${roleId}`);
    const { data: scripts } = await client.get(`/api/roles/${roleId}/scripts`);
    console.log({ scripts });

    return { role: roleData, scripts };
};

export default RoleShow;
