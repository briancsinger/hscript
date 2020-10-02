import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import remove from 'lodash/fp/remove';
import Router from 'next/router';
import Link from 'next/link';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
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
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddIcon from '@material-ui/icons/Add';

import useRequest from '../../hooks/use-request';
import DescriptionItems from '../../component/role/descriptionItems';
import DescriptionForm from '../../component/role/descriptionForm';
import Breadcrumbs from '../../component/dashboard/breadcrumbs';
import SkillsInput from '../../component/role/skillsInputs';
import DragableTextFieldListItems from '../../component/role/dragableTextFieldListItems';
import SkillListItem from '../../component/role/scriptListItem';
import getGravatar from '../../utils/get-gravatar';

const useStyles = makeStyles((theme) => ({
    boxWrapper: {
        [theme.breakpoints.up('xs')]: {
            padding: theme.spacing(2),
        },
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(4),
        },
        // [theme.breakpoints.up('md')]: {
        //     padding: theme.spacing(6),
        // },
    },
    skillsBoxWrapper: {
        [theme.breakpoints.up('xs')]: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            // paddingRight: theme.spacing(1),
            // paddingLeft: theme.spacing(1),
        },
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            // paddingRight: theme.spacing(2),
            // paddingLeft: theme.spacing(2),
        },
        [theme.breakpoints.up('md')]: {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
            // paddingRight: theme.spacing(3),
            // paddingLeft: theme.spacing(3),
        },
    },
    editorTextField: {
        width: '300px',
    },
    nameInput: {
        fontSize: theme.typography.h4.fontSize,
        fontFamily: theme.typography.h4.fontFamily,
    },
    scriptAddItem: {
        marginTop: theme.spacing(1),
    },
}));

const RoleShow = ({ currentUser, role, scripts, pathName }) => {
    const classes = useStyles();
    const [savingRole, setSavingRole] = useState(false);
    const [roleName, setRoleName] = useState(role.name);
    const [editorEmail, setEditorEmail] = useState('');
    const [deleteEditorId, setDeleteEditorId] = useState();
    const [scriptName, setScriptName] = useState('');
    const [skills, setSkills] = useState(role.skills);
    const [questions, setQuestions] = useState(role.questions);
    const [questionText, setQuestionText] = useState('');

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
            setEditorEmail('');
            Router.push('/roles/[roleId]', `/roles/${role.id}`);
        },
    });

    const {
        doRequest: removeEditorRequest,
        errors: removeEditorRequestErrors,
    } = useRequest({
        method: 'delete',
        onSuccess: (script) => {
            setDeleteEditorId();
            Router.push('/roles/[roleId]', `/roles/${role.id}`);
        },
    });

    const {
        doRequest: deleteSkillRequest,
        errors: deleteSkillRequestErrors,
    } = useRequest({
        method: 'delete',
        onSuccess: (role) => {
            Router.push('/roles/[roleId]', `/roles/${role.id}`);
            setSkills(role.skills);
        },
    });

    const {
        doRequest: addSkillRequest,
        errors: addSkillRequestErrors,
    } = useRequest({
        url: `/api/roles/${role.id}/skills`,
        method: 'post',
        onSuccess: (role) => {
            Router.push('/roles/[roleId]', `/roles/${role.id}`);
            setSkills(role.skills);
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

    const debouncedUpdateRoleQuestions = useCallback(
        debounce(() => {
            updateRoleRequest({ questions });
            setSavingRole(true);
        }, 500),
        [questions],
    );

    const handleRoleNameChange = (e) => {
        e.preventDefault();
        setRoleName(e.target.value);
    };

    const handleDeleteEditor = (deletedEditor) => {
        removeEditorRequest({
            url: `/api/roles/${role.id}/editors/${deletedEditor.id}/`,
        });
    };

    const handleAddScriptClicked = (e) => {
        e.preventDefault();
        Router.push('/roles/[roleId]/script', `/roles/${role.id}/script`);
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
        if (role.skills === skills) return;
        debouncedUpdateRoleSkills();
        // Cancel the debounce on useEffect cleanup.
        return debouncedUpdateRoleSkills.cancel;
    }, [skills, debouncedUpdateRoleSkills]);

    useEffect(() => {
        if (role.questions === questions) return;
        debouncedUpdateRoleQuestions();
        // Cancel the debounce on useEffect cleanup.
        return debouncedUpdateRoleQuestions.cancel;
    }, [questions, debouncedUpdateRoleQuestions]);

    const handleSaveDescriptionItem = ({ type, value }) => {
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
        setSkills(updatedSkills);
    };

    const handleAddSkill = (skillText) => {
        addSkillRequest({
            text: skillText,
        });
    };

    const handleDeleteSkill = (skillId) => {
        console.log(skillId);
        deleteSkillRequest({
            url: `/api/roles/${role.id}/skills/${skillId}`,
        });
    };

    const handleQuestionsChange = (updatedQuestions) => {
        setQuestions(updatedQuestions);
    };

    const editorList = (role.editors || []).map((editor, index) => (
        <Grid item key={editor.id}>
            <Chip
                label={editor.name}
                onDelete={() => handleDeleteEditor(editor)}
                avatar={
                    <Avatar
                        alt={editor.name}
                        src={getGravatar(editor.email, 50)}
                    >
                        {editor.name.slice(0, 1).toUpperCase()}
                    </Avatar>
                }
                variant="outlined"
            />
        </Grid>
    ));

    const skillList = (
        <SkillsInput
            initialSkills={skills}
            onChange={handleSkillsChange}
            onAddSkill={handleAddSkill}
            onDeleteSkill={handleDeleteSkill}
        />
    );

    const questionList = (
        <DragableTextFieldListItems
            initialItems={role.questions}
            onChange={handleQuestionsChange}
            itemName="question"
            itemType="question"
        />
    );

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

            <DndProvider backend={HTML5Backend}>
                <Grid container spacing={3} direction="column">
                    <Grid item>
                        <Paper>
                            <Box className={classes.boxWrapper}>
                                <TextField
                                    inputProps={{
                                        className: classes.nameInput,
                                    }}
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
                                <Grid container spacing={3} direction="column">
                                    <Grid item container spacing={1}>
                                        {editorList}
                                    </Grid>
                                    <Grid item>
                                        <form onSubmit={handleSubmitEditor}>
                                            <Grid container spacing={2}>
                                                <Grid item>
                                                    <TextField
                                                        className={
                                                            classes.editorTextField
                                                        }
                                                        value={editorEmail}
                                                        onChange={(e) =>
                                                            setEditorEmail(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Editor email (e.g. marta@intra.team)"
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        size="small"
                                                        type="submit"
                                                        color="primary"
                                                        variant="contained"
                                                    >
                                                        add
                                                    </Button>
                                                </Grid>
                                            </Grid>

                                            {addEditorRequestErrors}
                                        </form>
                                    </Grid>
                                </Grid>

                                <div></div>
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
                                    <DescriptionForm
                                        onSave={handleSaveDescriptionItem}
                                    />
                                </div>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" gutterBottom>
                            Skills:
                        </Typography>
                        <Paper>
                            <Box className={classes.skillsBoxWrapper}>
                                {skillList}
                                {addEditorRequestErrors}
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" gutterBottom>
                            Questions:
                        </Typography>
                        <Paper>
                            <Box className={classes.boxWrapper}>
                                <div className="">{questionList}</div>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" gutterBottom>
                            Scripts:
                        </Typography>

                        <Grid item container spacing={2}>
                            {scripts.map((script) => (
                                <Grid item key={script.id} xs={12} md={6}>
                                    <SkillListItem script={script} />
                                </Grid>
                            ))}
                            <Grid
                                item
                                key="add-button"
                                xs={12}
                                className={classes.scriptAddItem}
                            >
                                <Button
                                    startIcon={<AddIcon />}
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddScriptClicked}
                                >
                                    Add a script
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DndProvider>
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
