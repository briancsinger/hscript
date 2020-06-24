import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import useRequest from '../../hooks/use-request';
import DescriptionItems from '../../component/role/descriptionItems';
import DescriptionForm from '../../component/role/descriptionForm';

const RoleShow = ({ currentUser, role, scripts }) => {
    const [scriptName, setScriptName] = useState('');
    const [skillText, setSkillText] = useState('');
    const [questionText, setQuestionText] = useState('');

    const {
        doRequest: createScriptRequest,
        errors: createScriptRequestErrors,
    } = useRequest({
        url: `/api/roles/${role.id}/scripts`,
        method: 'post',
        body: {
            name: scriptName,
        },
        onSuccess: (script) => {
            Router.push('/scripts/[scriptId]', `/scripts/${script.id}`);
        },
    });

    const {
        doRequest: updateRoleRequest,
        errors: updateRoleRequestErrors,
    } = useRequest({
        url: `/api/roles/${role.id}`,
        method: 'put',
        onSuccess: (role) => {
            Router.push('/roles/[roleId]', `/roles/${role.id}`);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createScriptRequest();
    };

    const handleSkillSubmit = (e) => {
        e.preventDefault();

        const updatedSkills = [
            ...(role.skills || []),
            {
                text: skillText,
            },
        ];
        updateRoleRequest({ skills: updatedSkills });

        setSkillText('');
    };

    const handleQuestionSubmit = (e) => {
        e.preventDefault();

        const updatedQuestions = [
            ...(role.questions || []),
            {
                text: questionText,
            },
        ];
        updateRoleRequest({ questions: updatedQuestions });

        setQuestionText('');
    };

    const handleSaveItem = ({ type, value }) => {
        console.log({ type, value });
        const newDescriptionItem = {
            type,
            [type === 'link' ? 'url' : 'text']: value,
        };
        const updatedDescriptionItems = [
            ...(role.descriptionItems || []),
            newDescriptionItem,
        ];
        updateRoleRequest({ descriptionItems: updatedDescriptionItems });
    };

    const scriptList = scripts.map((script) => {
        return (
            <tr key={script.id}>
                <td>{script.name}</td>
                <td>
                    <Link
                        href="/scripts/[scriptId]"
                        as={`/scripts/${script.id}`}
                    >
                        <a>Details</a>
                    </Link>
                </td>
            </tr>
        );
    });

    const skillList = (role.skills || []).map((skill, index) => (
        <li className="list-group-item px-0" key={index}>
            {skill.text}
        </li>
    ));

    const questionList = (role.questions || []).map((question, index) => (
        <li className="list-group-item px-0" key={index}>
            {question.text}
        </li>
    ));

    return (
        <div>
            <div className="my-3">
                <span className="text-muted">Role name:</span>
                <h1>{role.name}</h1>
            </div>

            {updateRoleRequestErrors}

            <div className="card my-4">
                <h4 className="card-header bg-light">Role description:</h4>
                <div className="card-body">
                    <DescriptionItems
                        descriptionItems={role.descriptionItems}
                    />
                </div>

                <div className="card-footer">
                    <DescriptionForm onSave={handleSaveItem} />
                </div>
            </div>

            <div className="card my-4">
                <h4 className="card-header bg-light">Skills:</h4>

                <div className="card-body">
                    <ul className="list-group list-group-flush">{skillList}</ul>
                </div>

                <div className="card-footer">
                    <p>Add a skill</p>
                    <form onSubmit={handleSkillSubmit}>
                        <div className="form-group">
                            <div className="input-group">
                                <textarea
                                    placeholder="script name"
                                    value={skillText}
                                    onChange={(e) =>
                                        setSkillText(e.target.value)
                                    }
                                    className="form-control"
                                />
                                <div className="input-group-append">
                                    <input
                                        type="submit"
                                        className="btn btn-primary"
                                        value="Add"
                                    />
                                </div>
                            </div>
                        </div>
                        {createScriptRequestErrors}
                    </form>
                </div>
            </div>

            <div className="card my-4">
                <h4 className="card-header bg-light">Questions:</h4>

                <div className="card-body">
                    <ul className="list-group list-group-flush">
                        {questionList}
                    </ul>
                </div>

                <div className="card-footer">
                    <p>Add a question</p>
                    <form onSubmit={handleQuestionSubmit}>
                        <div className="form-group">
                            <div className="input-group">
                                <textarea
                                    placeholder="script name"
                                    value={questionText}
                                    onChange={(e) =>
                                        setQuestionText(e.target.value)
                                    }
                                    className="form-control"
                                />
                                <div className="input-group-append">
                                    <input
                                        type="submit"
                                        className="btn btn-primary"
                                        value="Add"
                                    />
                                </div>
                            </div>
                        </div>
                        {createScriptRequestErrors}
                    </form>
                </div>
            </div>

            <div className="card my-4">
                <h4 className="card-header bg-light">Scripts:</h4>

                <div className="card-body">
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

                <div className="card-footer">
                    <p>Create a Script</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-group">
                                <input
                                    placeholder="script name"
                                    value={scriptName}
                                    onChange={(e) =>
                                        setScriptName(e.target.value)
                                    }
                                    className="form-control"
                                />
                                <div className="input-group-append">
                                    <input
                                        type="submit"
                                        className="btn btn-primary"
                                        value="Add"
                                    />
                                </div>
                            </div>
                        </div>
                        {createScriptRequestErrors}
                    </form>
                </div>
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
