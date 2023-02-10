import { combineReducers } from 'redux';
import app from './appReducer';
import products from './productReducer';
import auth from './authReducer';
import register from './registerReducer';
import trendingTips from './trendingTipsReducer';
import interestingQA from './interestingQuestionsReducer';
import usefulReviews from './usefulReviewsReducer';
import chats from './chatReducer';
import feed from './feedReducer';
import notification from './notificationReducer';

const reducer = combineReducers({
    app,
    auth,
    products,
    register,
    trendingTips,
    interestingQA,
    usefulReviews,
    chats,
    feed,
    notification,
});

export default reducer;
