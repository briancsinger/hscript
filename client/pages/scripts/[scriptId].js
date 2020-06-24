import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import useRequest from '../../hooks/use-request';
import ScriptItems from '../../component/script/scriptItems';
import ScriptForm from '../../component/script/itemsForm';

const ScriptShow = ({ currentUser, script = {}, role = {} }) => {
    const {
        doRequest: updateScriptRequest,
        errors: updateScriptRequestErrors,
    } = useRequest({
        url: `/api/scripts/${script.id}`,
        method: 'put',
        onSuccess: (script) => {
            Router.push('/scripts/[scriptId]', `/scripts/${script.id}`);
        },
    });

    const handleSaveItem = ({ type, value }) => {
        const scriptItem = {
            type,
            text: value,
        };
        const updatedScriptItems = [...(script.items || []), scriptItem];
        updateScriptRequest({ items: updatedScriptItems });
    };

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

            {updateScriptRequestErrors}

            <div className="card my-4">
                <h4 className="card-header bg-light">Script items:</h4>
                <div className="card-body">
                    <ScriptItems items={script.items} />
                </div>

                <div className="card-footer">
                    <ScriptForm onSave={handleSaveItem} />
                </div>
            </div>
        </div>
    );
};

ScriptShow.getInitialProps = async (context, client) => {
    const { roleId, scriptId } = context.query;
    try {
        const { data: script } = await client.get(`/api/scripts/${scriptId}`);
        const { data: role } = await client.get(`/api/roles/${script.role}`);
        return { script, role };
    } catch (e) {
        console.error(e);
    }
};

export default ScriptShow;
