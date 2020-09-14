import { useState } from 'react';
import Router from 'next/router';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';

import useRequest from '../../hooks/use-request';

const useStyles = makeStyles((theme) => ({
    boxWrapper: {
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing(10),
        },
    },
    nameField: {
        width: '80%',
    },
}));

const NewRole = () => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/roles',
        method: 'post',
        body: {
            name,
        },
        onSuccess: (role) => {
            Router.push('/roles/[roleId]', `/roles/${role.id}`);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        doRequest();
    };

    return (
        <Box className={classes.boxWrapper}>
            <Container maxWidth="sm">
                <form onSubmit={handleSubmit}>
                    <Card>
                        {/* <CardHeader
                        avatar={
                            <Avatar>
                                <AddIcon variant="rounded" />
                            </Avatar>
                        }
                        title={
                            <Typography variant="h5">
                                Create a role
                            </Typography>
                        }
                        /> */}
                        <CardContent>
                            <Grid container direction="column">
                                <Grid item>
                                    <Box mb={5}>
                                        <Typography variant="h6">
                                            To get started, give your role a
                                            name
                                        </Typography>
                                    </Box>
                                    <TextField
                                        id="name"
                                        className={classes.nameField}
                                        label="Name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        xs={12}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button
                                color="secondary"
                                disabled={!name}
                                type="submit"
                            >
                                Create
                            </Button>
                        </CardActions>
                    </Card>
                </form>
            </Container>
        </Box>
    );
};

NewRole.getInitialProps = async (context, client, currentUser) => {
    return { client };
};

export default NewRole;
