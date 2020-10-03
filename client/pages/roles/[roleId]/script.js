import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import useRequest from '../../../hooks/use-request';
import ScriptItems from '../../../component/script/scriptItems';
import ScriptForm from '../../../component/script/itemsForm';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Box from '@material-ui/core/Box';
import { makeStyles, Typography, Button } from '@material-ui/core';

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

const NewScript = ({ currentUser, role = {}, pathName }) => {
    const [savingScript, setSavingScript] = useState(false);
    const [scriptName, setScriptName] = useState('');
    const classes = useStyles();
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

    const handleScriptNameChange = (e) => {
        setScriptName(e.target.value);
    };

    const handleCreateScriptClicked = (e) => {
        if (!scriptName) return;

        e.preventDefault();
        createScriptRequest();
    };

    return (
        <Container maxWidth="md">
            <Grid container justify="space-between">
                <Grid item>
                    <Box mb={2}>
                        <Breadcrumbs
                            pathName={pathName}
                            currentPageName="new script"
                        />
                    </Box>
                </Grid>
                {savingScript && (
                    <Grid item>
                        <CircularProgress size={30} />
                    </Grid>
                )}
            </Grid>

            <Grid container spacing={3} direction="column">
                <Grid item>
                    <Typography variant="h5" gutterBottom>
                        Give the new script a name
                    </Typography>
                    <Paper>
                        <Box className={classes.boxWrapper}>
                            <Grid container spacing={3} direction="column">
                                <Grid item>
                                    <TextField
                                        inputProps={{
                                            className: classes.nameInput,
                                        }}
                                        id="name"
                                        label="Name"
                                        value={scriptName}
                                        onChange={handleScriptNameChange}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        disabled={!scriptName}
                                        onClick={handleCreateScriptClicked}
                                    >
                                        Create script
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <div>
                <Link href="/roles/[roleId]" as={`/roles/${role.id}`}>
                    <a className="mt-3 mb-4 d-block">
                        <i>
                            <b>&lt; back to role:</b>&nbsp;({role.name})
                        </i>
                    </a>
                </Link>

                {createScriptRequestErrors}
            </div>
        </Container>
    );
};

NewScript.getInitialProps = async (context, client) => {
    const { roleId } = context.query;
    const { pathname: pathName } = context;

    try {
        const { data: role } = await client.get(`/api/roles/${roleId}`);
        return { role, pathName };
    } catch (e) {
        console.error(e);
    }
};

export default NewScript;
