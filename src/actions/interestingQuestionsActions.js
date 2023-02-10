import axios from 'axios';

const INTERESTING_QA = 'interestingQA';

export const LOADING = `${INTERESTING_QA}/LOADING`;
export const UPDATE = `${INTERESTING_QA}/UPDATE`;
export const ERROR = `${INTERESTING_QA}/ERROR`;
export const RESET = `${INTERESTING_QA}/RESET`;

export const resetInterestingQA = () => ({
    type: RESET,
});

export const fetchInterestingQA = () => {
    return (dispatch) => {
        dispatch({ type: RESET });
        dispatch({ type: LOADING, loading: true });
        axios
            .get('/api/discover/interestingQA')
            .then((res) => {
                Array.isArray(res.data) &&
                    dispatch({
                        type: UPDATE,
                        interestingQA: res.data,
                    });
            })
            .catch((error) => {
                console.log('Error in fetching interestingQA.');
                dispatch({ type: ERROR, error });
            });
    };
};
