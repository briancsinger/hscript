import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import useRequest from '../../hooks/use-request';

const RoleShow = ({ currentUser, script }) => {
    return (
        <div>
            <h1>{script.name}</h1>
        </div>
    );
};

RoleShow.getInitialProps = async (context, client) => {
    const { roleId, scriptId } = context.query;
    const { data } = await client.get(
        `/api/roles/${roleId}/scripts/${scriptId}`,
    );

    return { script };
};

export default RoleShow;
