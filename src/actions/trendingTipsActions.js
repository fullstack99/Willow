import axios from 'axios';

const TRENDING_TIPS = 'trendingTips';

export const LOADING = `${TRENDING_TIPS}/LOADING`;
export const UPDATE = `${TRENDING_TIPS}/UPDATE`;
export const ERROR = `${TRENDING_TIPS}/ERROR`;
export const RESET = `${TRENDING_TIPS}/RESET`;

export const resetTrendingTips = () => ({
    type: RESET,
});

export const fetchTrendingTips = () => {
    return (dispatch) => {
        dispatch({ type: RESET });
        dispatch({ type: LOADING, loading: true });
        axios
            .get('/api/discover/trendingTips')
            .then((res) => {
                Array.isArray(res.data) &&
                    dispatch({
                        type: UPDATE,
                        trendingTips: res.data,
                    });
            })
            .catch((error) => {
                console.log('Error in fetching trendingTips.');
                dispatch({ type: ERROR, error });
            });
    };
};
