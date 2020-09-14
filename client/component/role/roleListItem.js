import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import Router from 'next/router';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    roleName: {
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
        },
    },
}));

const RoleListItem = ({ role = {} }) => {
    const classes = useStyles();

    const handleClick = () => {
        Router.push('/roles/[roleId]', `/roles/${role.id}`);
    };

    return (
        <Card>
            <CardHeader
                action={
                    <IconButton aria-label="">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={
                    <Typography
                        className={classes.roleName}
                        variant="h5"
                        color="initial"
                        onClick={handleClick}
                    >
                        {role.name}
                    </Typography>
                }
                subheader={role.createdBy}
            />
            <CardContent>
                <Typography variant="body1" color="initial">
                    Praesent sapien massa, convallis a pellentesque nec, egestas
                    non nisi. Vivamus suscipit tortor eget felis porttitor
                    volutpat.
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RoleListItem;
