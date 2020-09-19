import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import Router from 'next/router';
import Link from 'next/link';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Paper } from '@material-ui/core';

import useRequest from '../../hooks/use-request';
import DescriptionItems from '../../component/role/descriptionItems';
import DescriptionForm from '../../component/role/descriptionForm';
import Breadcrumbs from '../../component/dashboard/breadcrumbs';
import SkillsInput from '../../component/role/skillsInputs';

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
    const [savingRole, setSavingRole] = useState(false);
    const [roleName, setRoleName] = useState(role.name);
    const [editorEmail, setEditorEmail] = useState('');
    const [scriptName, setScriptName] = useState('');
    const [skills, setSkills] = useState(role.skills);
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
            setSavingRole(false);
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

    const debouncedUpdateRoleName = useCallback(
        debounce(() => {
            updateRoleRequest({ name: roleName });
            setSavingRole(true);
        }, 500),
        [roleName],
    );

    const debouncedUpdateRoleSkills = useCallback(
        debounce(() => {
            updateRoleRequest({ skills });
            setSavingRole(true);
        }, 500),
        [skills],
    );

    const handleRoleNameChange = (e) => {
        e.preventDefault();
        setRoleName(e.target.value);
    };

    useEffect(() => {
        // Only going to update rolename if it's a non-empty string
        if (roleName && role.name !== roleName) {
            debouncedUpdateRoleName();
        }
        // Cancel the debounce on useEffect cleanup.
        return debouncedUpdateRoleName.cancel;
    }, [roleName, debouncedUpdateRoleName]);

    useEffect(() => {
        debouncedUpdateRoleSkills();
        // Cancel the debounce on useEffect cleanup.
        return debouncedUpdateRoleSkills.cancel;
    }, [skills, debouncedUpdateRoleSkills]);

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

    const handleSkillsChange = (updatedSkills) => {
        console.log({ updatedSkills });
        setSkills(updatedSkills);
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

    const skillList = (
        <SkillsInput
            initialSkills={role.skills}
            onChange={handleSkillsChange}
        />
    );

    const questionList = (role.questions || []).map((question, index) => (
        <li className="list-group-item px-0" key={index}>
            {question.text}
        </li>
    ));

    return (
        <Container maxWidth="md">
            <Grid container justify="space-between">
                <Grid item>
                    <Box mb={2}>
                        <Breadcrumbs
                            pathName={pathName}
                            currentPageName={role.name}
                        />
                    </Box>
                </Grid>
                {savingRole && (
                    <Grid item>
                        <CircularProgress size={30} />
                    </Grid>
                )}
            </Grid>

            <Grid container spacing={3} direction="column">
                <Grid item>
                    <Paper>
                        <Box className={classes.boxWrapper}>
                            <Typography variant="h4">{role.name}</Typography>
                            <TextField
                                id="name"
                                label="Name"
                                value={roleName}
                                onChange={handleRoleNameChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item>
                    <Typography variant="h5" gutterBottom>
                        Editors:
                    </Typography>
                    <Paper>
                        <Box className={classes.boxWrapper}>
                            <div>
                                <ul>{editorList}</ul>
                            </div>

                            <div>
                                <Typography variant="body1">
                                    Add an editor
                                </Typography>
                                <form onSubmit={handleSubmitEditor}>
                                    <div>
                                        <div>
                                            <input
                                                placeholder="email address"
                                                value={editorEmail}
                                                onChange={(e) =>
                                                    setEditorEmail(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <div>
                                                <input
                                                    type="submit"
                                                    value="Add"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {addEditorRequestErrors}
                                </form>
                            </div>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item>
                    <Typography variant="h5" gutterBottom>
                        Role description:
                    </Typography>
                    <Paper>
                        <Box className={classes.boxWrapper}>
                            <div>
                                <DescriptionItems
                                    descriptionItems={role.descriptionItems}
                                />
                            </div>

                            <div>
                                <DescriptionForm onSave={handleSaveItem} />
                            </div>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item>
                    <Typography variant="h5" gutterBottom>
                        Skills:
                    </Typography>
                    <Paper>
                        <Box className={classes.boxWrapper}>
                            <div className="">{skillList}</div>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item>
                    <Typography variant="h5">Questions:</Typography>
                    <Paper>
                        <Box className={classes.boxWrapper}>
                            <div>
                                <ul>{questionList}</ul>
                            </div>

                            <div>
                                <p>Add a question</p>
                                <form onSubmit={handleQuestionSubmit}>
                                    <div>
                                        <div>
                                            <textarea
                                                placeholder="question"
                                                value={questionText}
                                                onChange={(e) =>
                                                    setQuestionText(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <div>
                                                <input
                                                    type="submit"
                                                    value="Add"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item>
                    <Typography variant="h5">Scripts:</Typography>
                    <Paper>
                        <Box className={classes.boxWrapper}>
                            <div>
                                <table>
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
                                <p>Create a Script</p>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <div>
                                            <input
                                                placeholder="script name"
                                                value={scriptName}
                                                onChange={(e) =>
                                                    setScriptName(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <div>
                                                <input
                                                    type="submit"
                                                    value="Add"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {createScriptRequestErrors}
                                </form>
                            </div>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {updateRoleRequestErrors}
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
