import { GET_HOT_ITEMS, GET_AMAZON_PRODUCTS, GET_PRODUCT_BY_ID, SEARCH_START } from '../actions/productAction';

const INIT_STATE = {
    hot_items: [],
    product_list: [],
    single_product: null,
    amazon_products: [],
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_HOT_ITEMS: {
            return { ...state, hot_items: action.payload, loading: false };
        }
        case GET_PRODUCT_BY_ID: {
            return { ...state, single_product: action.payload, loading: false };
        }
        case GET_AMAZON_PRODUCTS: {
            return { ...state, amazon_products: action.payload, loading: false };
        }
        case SEARCH_START: {
            return { ...state, loading: action.payload };
        }
        default:
            return state;
    }
};
