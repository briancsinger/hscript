import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, { ...body, ...props });
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err) {
            console.log(err);
            setErrors(
                <div className="alert alert-danger alert-dismissible fade show my-3">
                    <h4>Oops</h4>
                    <ul>
                        {err.response.data.errors.map((e) => (
                            <li key={e.message}>{e.message}</li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        className="close"
                        onClick={() => setErrors(null)}
                    >
                        <span>&times;</span>
                    </button>
                </div>,
            );
        }
    };

    return { doRequest, errors };
};

export default useRequest;
