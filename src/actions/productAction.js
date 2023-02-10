import axios from 'axios';
import Discover from '../service/firebase_requests/Discover';

const PRODUCTS = 'products';
export const GET_HOT_ITEMS = `${PRODUCTS}/GET_HOT_ITEMS`;
export const GET_PRODUCT_BY_ID = `${PRODUCTS}/GET_PRODUCT_BY_ID`;
export const GET_AMAZON_PRODUCTS = `${PRODUCTS}/GET_AMAZON_PRODUCTS`;
export const SEARCH_START = `${PRODUCTS}/SEARCH_START`;

export const fetchHotItems = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            Discover.fetchHotItems()
                .then((data) => {
                    resolve(
                        dispatch({
                            type: GET_HOT_ITEMS,
                            payload: data,
                        }),
                    );
                })
                .catch(() =>
                    resolve(
                        dispatch({
                            type: GET_HOT_ITEMS,
                            payload: [],
                        }),
                    ),
                );
        });
    };
};

export const getAmazonProducts = (search) => {
    return (dispatch) => {
        dispatch(searchStart(true));
        axios
            .get(`/api/discover/items?search_term=${search}&sort_by=price_low_to_high`)
            .then((res) => {
                console.log('Amazon', res);
                dispatch(searchStart(true));
                dispatch({
                    type: GET_AMAZON_PRODUCTS,
                    payload: res.data.search_results,
                });
            })
            .catch((err) => {
                dispatch(searchStart(false));
            });
    };
};

const searchStart = (condition) => {
    return (dispatch) => {
        dispatch({
            type: SEARCH_START,
            payload: condition,
        });
    };
};
