import Typography from '@material-ui/core/Typography';
import Link from 'next/link';

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://singer.land/">
                hscript
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
};

export default Copyright;
