import * as FEED_ACTIONS from '../actions/feedActions';

const initialState = {
    loading: true,
    items: null,
    endReached: false,
    endDocument: null,
    selected: 'ALL',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FEED_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        case FEED_ACTIONS.INIT_FETCH:
            return {
                ...state,
                loading: false,
                items: action?.items || [],
                endReached: action?.endReached || false,
                endDocument: action?.endDocument || state.endDocument,
            };
        case FEED_ACTIONS.LOAD_MORE:
            return {
                ...state,
                loading: false,
                items: [...state.items, ...action.items],
                endReached: action?.endReached || false,
                endDocument: action?.endDocument || state.endDocument,
            };
        case FEED_ACTIONS.ADD_POST:
            return {
                ...state,
                loading: false,
                items: Array.isArray(state.items) ? [action.post, ...state.items] : [action.post],
            };
        case FEED_ACTIONS.UPDATE_POST:
            return {
                ...state,
                loading: false,
                items: state.items?.map((p) => (p.id === action.post.id ? action.post : p)),
            };
        case FEED_ACTIONS.DELETE_POST:
            return {
                ...state,
                loading: false,
                items: state.items?.filter((p) => p.id !== action.post.id),
            };
        case FEED_ACTIONS.SELECT_TYPE:
            return {
                ...state,
                selected: action.selected,
            };
        default:
            return state;
    }
};
