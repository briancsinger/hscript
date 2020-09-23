import Card from '@material-ui/core/Card';
import clsx from 'clsx';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import Typography from '@material-ui/core/Typography';
import Router from 'next/router';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    scriptCard: {
        '.MuiCard-root&:hover': {
            cursor: 'pointer',
            boxShadow: theme.shadows[3],
            transition: `boxShadow ${theme.transitions.easing.easeInOut} ${theme.transitions.duration.standard}`,
        },
    },
    scriptName: {
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));

const ScriptListItem = ({ script = {} }) => {
    const classes = useStyles();

    const handleClick = () => {
        Router.push('/scripts/[scriptId]', `/scripts/${script.id}`);
    };

    return (
        <Card className={classes.scriptCard} onClick={handleClick}>
            <CardHeader
                avatar={<DescriptionOutlinedIcon />}
                action={
                    <IconButton aria-label="" onClick={handleClick}>
                        <EditOutlinedIcon />
                    </IconButton>
                }
                title={
                    <Typography
                        className={clsx(classes.scriptCard, classes.scriptName)}
                        variant="h6"
                        color="initial"
                        onClick={handleClick}
                    >
                        {script.name}
                    </Typography>
                }
            />
            {/* <CardContent>
                <Typography variant="body1" color="initial">
                    Praesent sapien massa, convallis a pellentesque nec, egestas
                    non nisi. Vivamus suscipit tortor eget felis porttitor
                    volutpat.
                </Typography>
            </CardContent> */}
        </Card>
    );
};

export default ScriptListItem;
