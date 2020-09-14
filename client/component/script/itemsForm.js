import { useState } from 'react';

const ItemsForm = ({ onSave }) => {
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
        <div>
            {editing && (
                <>
                    <div className="form-group">
                        <textarea
                            value={value}
                            rows="3"
                            onChange={(e) => setValue(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div>
                        <button
                            className="btn btn-primary mr-2"
                            onClick={handleSaveItem}
                        >
                            Save
                        </button>
                        <button
                            className="btn mr-2"
                            onClick={handleCancleClick}
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
            {!editing && (
                <div>
                    <button
                        className="btn btn-primary mr-2"
                        onClick={handleAddQuestionItem}
                    >
                        + Question
                    </button>
                    <button
                        className="btn btn-primary mr-2"
                        onClick={handleAddTextItem}
                    >
                        + Text
                    </button>
                </div>
            )}
        </div>
    );
};

export default ItemsForm;
