import axios from 'axios';

const USEFUL_REVIEWS = 'usefulReviews';

export const LOADING = `${USEFUL_REVIEWS}/LOADING`;
export const UPDATE = `${USEFUL_REVIEWS}/UPDATE`;
export const ERROR = `${USEFUL_REVIEWS}/ERROR`;
export const RESET = `${USEFUL_REVIEWS}/RESET`;

export const resetUsefulReviews = () => ({
    type: RESET,
});

export const fetchUsefulReviews = () => {
    return (dispatch) => {
        dispatch({ type: RESET });
        dispatch({ type: LOADING, loading: true });
        axios
            .get('/api/discover/usefulReviews')
            .then((res) => {
                Array.isArray(res.data) &&
                    dispatch({
                        type: UPDATE,
                        usefulReviews: res.data,
                    });
            })
            .catch((error) => {
                console.log('Error in fetching usefulReviews.');
                dispatch({ type: ERROR, error });
            });
    };
};
