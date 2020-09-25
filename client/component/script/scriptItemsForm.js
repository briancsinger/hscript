import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const ScriptItemsForm = ({ onSave }) => {
    const [value, setValue] = useState('');
    const [type, setType] = useState('');
    const [editing, setEditing] = useState(false);

    const handleAddQuestionItem = () => handleAddItem('question');
    const handleAddTextItem = () => handleAddItem('text');
    const handleAddItem = (itemType) => {
        setType(itemType);
        setEditing(true);
    };

    const handleSaveItem = (e) => {
        if (onSave) {
            onSave({ type, value });
        }
        setType('');
        setEditing(false);
        setValue('');
    };

    const handleCancleClick = () => {
        setType('');
        setEditing(false);
        setValue('');
    };

    return (
        <>
            {editing && (
                <Grid container spacing={1} direction="column">
                    <Grid item>
                        {type === 'text' ? (
                            <TextField
                                id="text"
                                label="Text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                rows="3"
                                multiline
                                fullWidth
                                variant="outlined"
                            />
                        ) : (
                            <TextField
                                id="question"
                                label="Question"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                type="url"
                                fullWidth
                                variant="outlined"
                            />
                        )}
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={handleSaveItem}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={handleCancleClick}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            {!editing && (
                <Grid container spacing={1}>
                    <Grid item>
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={handleAddQuestionItem}
                        >
                            Add question
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={handleAddTextItem}
                        >
                            Add text
                        </Button>
                    </Grid>
                </Grid>
            )}
        </>
    );
};

export default ScriptItemsForm;
