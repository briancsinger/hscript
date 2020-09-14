import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Paper } from '@material-ui/core';

import useRequest from '../../hooks/use-request';
import DescriptionItems from '../../component/role/descriptionItems';
import DescriptionForm from '../../component/role/descriptionForm';
import Breadcrumbs from '../../component/dashboard/breadcrumbs';

const useStyles = makeStyles((theme) => ({
    boxWrapper: {
        [theme.breakpoints.up('xs')]: {
            padding: theme.spacing(2),
        },
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(4),
        },
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(6),
        },
    },
}));

const RoleShow = ({ currentUser, role, scripts, pathName }) => {
    const classes = useStyles();
    const [editorEmail, setEditorEmail] = useState('');
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
        doRequest: addEditorRequest,
        errors: addEditorRequestErrors,
    } = useRequest({
        url: `/api/roles/${role.id}/editors`,
        method: 'post',
        body: {
            email: editorEmail,
        },
        onSuccess: (script) => {
            Router.push('/roles/[roleId]', `/roles/${role.id}`);
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

    const handleSubmitEditor = (e) => {
        e.preventDefault();
        addEditorRequest();
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

    const editorList = (role.editors || []).map((editor, index) => (
        <li className="list-group-item px-0" key={index}>
            {editor.name} ({editor.email})
        </li>
    ));

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
        <Container maxWidth="md">
            <Box mb={2}>
                <Breadcrumbs pathName={pathName} currentPageName={role.name} />
            </Box>
            <Paper>
                <Box className={classes.boxWrapper}>
                    <div className="my-3">
                        <span className="text-muted">Role name:</span>
                        <h1>{role.name}</h1>
                    </div>

                    {updateRoleRequestErrors}

                    <div className="card my-4">
                        <h4 className="card-header bg-light">Editors:</h4>

                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {editorList}
                            </ul>
                        </div>

                        <div className="card-footer">
                            <p>Add an editor</p>
                            <form onSubmit={handleSubmitEditor}>
                                <div className="form-group">
                                    <div className="input-group">
                                        <input
                                            placeholder="email address"
                                            value={editorEmail}
                                            onChange={(e) =>
                                                setEditorEmail(e.target.value)
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
                                {addEditorRequestErrors}
                            </form>
                        </div>
                    </div>

                    <div className="card my-4">
                        <h4 className="card-header bg-light">
                            Role description:
                        </h4>
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
                            <ul className="list-group list-group-flush">
                                {skillList}
                            </ul>
                        </div>

                        <div className="card-footer">
                            <p>Add a skill</p>
                            <form onSubmit={handleSkillSubmit}>
                                <div className="form-group">
                                    <div className="input-group">
                                        <textarea
                                            placeholder="skill"
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
                                            placeholder="question"
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
                </Box>
            </Paper>
        </Container>
    );
};

RoleShow.getInitialProps = async (context, client) => {
    const { query: { roleId } = {}, pathname: pathName } = context;
    const { data: roleData } = await client.get(`/api/roles/${roleId}`);
    const { data: scripts } = await client.get(`/api/roles/${roleId}/scripts`);

    return { role: roleData, scripts, pathName };
};

export default RoleShow;
