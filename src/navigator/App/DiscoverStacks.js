import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import { colors, fonts } from '../../constants';
import * as Constants from '../constants';

import Discover from '../../screens/App/Discover';
import Search from '../../screens/App/Search';
import TrendingTipsScreen from '../../screens/App/TrendingTips';
import TipsScreen from '../../screens/App/Tips';
import QuestionsScreen from '../../screens/App/Questions';
import ReviewsScreen from '../../screens/App/Reviews';
import HotItemsScreen from '../../screens/App/HotItems';
import InterestingQAScreen from '../../screens/App/InterestingQA';
import UsefulReviewsScreen from '../../screens/App/UsefulReviews';
import ProductScreen from '../../screens/App/Products';
import UserProfile from '../../screens/App/Profiles/UserProfile';
import Followers from '../../screens/App/Profiles/Followers';
import CreateTip from '../../screens/App/CreateTip';
import CreateQuestion from '../../screens/App/CreateQuestion';
import CreateReview from '../../screens/App/CreateReview';
import TextInput from '../../screens/App/TextInputScreen';
import TipInput from '../../screens/App/TipInputScreen';
import SearchProduct from '../../screens/App/Product/SearchProduct';
import ShareInWillow from '../../screens/App/ShareInWillow';
import WillowWebView from '../../screens/WillowWebView';

import HeaderIcon from '../../components/App/HeaderIcon';

const noHeaderOption = {
    headerShown: false,
};

const DiscoverStacks = () => {
    const defaultScreenOptions = {
        title: '',
        headerStyle: {
            backgroundColor: colors.WHITE,
            borderBottomWidth: 0,
            shadowColor: 'transparent',
        },
        headerTintColor: colors.WHITE,
        headerTitleStyle: {
            fontFamily: fonts.NEWYORKEXTRALARGE_MEDIUM,
            fontSize: 18,
            color: colors.BLACK,
        },
        headerLeft: ({ onPress }) => {
            return <HeaderIcon onPress={onPress} />;
        },
    };

    return (
        <Stack.Navigator screenOptions={{ headerShown: true, gestureEnabled: true }} initialRouteName={Constants.HOME}>
            <Stack.Screen name={Constants.HOME} component={Discover} options={noHeaderOption} />
            <Stack.Screen name={Constants.SEARCH} component={Search} options={noHeaderOption} />
            <Stack.Screen name={Constants.TRENDING_TIPS_LIST} component={TrendingTipsScreen} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.TIPS} component={TipsScreen} options={noHeaderOption} />
            <Stack.Screen name={Constants.QUESTIONS} component={QuestionsScreen} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.REVIEWS} component={ReviewsScreen} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.PRODUCT} component={ProductScreen} options={noHeaderOption} />
            <Stack.Screen name={Constants.HOT_ITEMS_LIST} component={HotItemsScreen} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.INTERESTING_QA_LIST} component={InterestingQAScreen} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.USEFUL_REVIEWS_LIST} component={UsefulReviewsScreen} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.USER_PROFILE} component={UserProfile} options={noHeaderOption} />
            <Stack.Screen name={Constants.FOLLOWERS} component={Followers} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.CREATE_TIP} component={CreateTip} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.CREATE_QUESTION} component={CreateQuestion} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.CREATE_REVIEW} component={CreateReview} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.TEXT_INPUT} component={TextInput} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.TIP_INPUT} component={TipInput} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.SEARCH_PRODUCT} component={SearchProduct} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.SHARE_IN_WILLOW} component={ShareInWillow} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.WEBVIEW} component={WillowWebView} options={defaultScreenOptions} />
        </Stack.Navigator>
    );
};

export default DiscoverStacks;
