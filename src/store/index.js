import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-community/async-storage';
import JSOG from 'jsog';
import logger from 'redux-logger';
import reducers from '../reducers';

const initialState = {};
const middleware = [thunk];

const parseTransform = createTransform(
    (inboundState) => {
        return JSOG.encode(inboundState);
    },
    (outboundState) => {
        return JSOG.decode(outboundState);
    },
);

const persistConfig = {
    key: 'root',
    transform: [parseTransform],
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
    blacklist: ['register', 'app', 'trendingTips', 'interestingQA', 'usefulReviews', 'feed'],
};

const persistedReducer = persistReducer(persistConfig, reducers);
const composeEnhancers = composeWithDevTools({ maxAge: 25 }) || window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

export const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));

// export const store = createStore(pReducer,applyMiddleware(thunk,/*logger*/));
export const persistor = persistStore(store);
