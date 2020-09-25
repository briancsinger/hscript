import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import useRequest from '../../hooks/use-request';

// import ScriptForm from '../../component/script/itemsForm';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Box from '@material-ui/core/Box';
import { makeStyles, Typography } from '@material-ui/core';
import ScriptItemsForm from '../../component/script/scriptItemsForm';
import ScriptItems from '../../component/script/scriptItems';

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

const ScriptShow = ({ currentUser, script = {}, role = {}, pathName }) => {
    const [savingScript, setSavingScript] = useState(false);
    const [scriptName, setScriptName] = useState(script.name);
    const classes = useStyles();
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

    const handleSaveScriptItems = ({ type, value }) => {
        const newScriptItem = {
            type,
            [type === 'link' ? 'url' : 'text']: value,
        };
        const updatedScriptItems = [...(script.items || []), newScriptItem];
        updateScriptRequest({ items: updatedScriptItems });
    };

    const handleScriptNameChange = (e) => {
        setScriptName(e.target.value);
    };

    return (
        <Container maxWidth="md">
            <Grid container justify="space-between">
                <Grid item>
                    <Box mb={2}>
                        <Breadcrumbs
                            pathName={pathName}
                            currentPageName={script.name}
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
                    <Paper>
                        <Box className={classes.boxWrapper}>
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
                        </Box>
                    </Paper>
                </Grid>
                <Grid item>
                    <Typography variant="h5" gutterBottom>
                        Script items:
                    </Typography>
                    <Paper>
                        <Box className={classes.boxWrapper}>
                            <div>
                                <ScriptItems items={script.items} />
                            </div>

                            <div>
                                <ScriptItemsForm
                                    onSave={handleSaveScriptItems}
                                />
                            </div>
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

                {updateScriptRequestErrors}

                {/* <div className="card my-4">
                    <h4 className="card-header bg-light">Script items:</h4>
                    <div className="card-body">
                        <ScriptItems items={script.items} />
                    </div>

                    <div className="card-footer">
                        <ScriptForm onSave={handleSaveItem} />
                    </div>
                </div> */}
            </div>
        </Container>
    );
};

ScriptShow.getInitialProps = async (context, client) => {
    const { roleId, scriptId } = context.query;
    const { pathname: pathName } = context;

    try {
        const { data: script } = await client.get(`/api/scripts/${scriptId}`);
        const { data: role } = await client.get(`/api/roles/${script.role}`);
        return { script, role, pathName };
    } catch (e) {
        console.error(e);
    }
};

export default ScriptShow;
