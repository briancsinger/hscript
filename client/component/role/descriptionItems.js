import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

const DescriptionItem = ({ descriptionItems = [] }) => {
    const renderLinkItem = (item, index) => (
        <Typography variant="body1">
            <Link href={item.url} target="_blank">
                {item.url}
            </Link>
        </Typography>
    );

    const renderTextItem = (item, index) => {
        return <Typography variant="body1">{item.text}</Typography>;
    };

    const renderItem = (item, index) => {
        switch (item.type) {
            case 'link':
                return renderLinkItem(item, index);
            case 'text':
                return renderTextItem(item, index);
            default:
                return;
        }
    };

    const itemsList = descriptionItems.map((item, index) => (
        <Box key={index} mb={3}>
            {renderItem(item, index)}
        </Box>
    ));

    return itemsList;
};

export default DescriptionItem;
