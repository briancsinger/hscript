import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import useRequest from '../../hooks/use-request';

const RoleShow = ({ currentUser, script = {}, role = {} }) => {
    return (
        <div>
            <Link href="/roles/[roleId]" as={`/roles/${role.id}`}>
                <a className="mt-3 mb-4 d-block">
                    <i>
                        <b>&lt; back to role:</b>&nbsp;({role.name})
                    </i>
                </a>
            </Link>
            <h3>script name:</h3>
            <h1>{script.name}</h1>
        </div>
    );
};

RoleShow.getInitialProps = async (context, client) => {
    const { roleId, scriptId } = context.query;
    try {
        const { data: script } = await client.get(`/api/scripts/${scriptId}`);
        const { data: role } = await client.get(`/api/roles/${script.role}`);
        return { script, role };
    } catch (e) {
        console.log(e);
    }
};

export default RoleShow;
