import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';

const ScriptItems = ({ items = [] }) => {
    const renderQuestionItem = (item, index) => (
        <Typography variant="body1" color="primary">
            {item.text}
        </Typography>
    );

    const renderTextItem = (item, index) => {
        return <Typography variant="body1">{item.text}</Typography>;
    };

    const renderItem = (item, index) => {
        switch (item.type) {
            case 'question':
                return renderQuestionItem(item, index);
            case 'text':
                return renderTextItem(item, index);
            default:
                return;
        }
    };

    const itemsList = items.map((item, index) => (
        <Box key={index} mb={3}>
            {renderItem(item, index)}
        </Box>
    ));

    return itemsList;
};

export default ScriptItems;
