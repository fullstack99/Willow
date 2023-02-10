import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import * as Constants from '../constants';
import { colors, fonts } from '../../constants';
import HeaderIcon from '../../components/App/HeaderIcon';
import Feed from '../../screens/App/Feed';
import CreateTip from '../../screens/App/CreateTip';
import CreateQuestion from '../../screens/App/CreateQuestion';
import CreateReview from '../../screens/App/CreateReview';
import TextInput from '../../screens/App/TextInputScreen';
import TipInput from '../../screens/App/TipInputScreen';
import SearchProduct from '../../screens/App/Product/SearchProduct';
import Tips from '../../screens/App/Tips';
import Questions from '../../screens/App/Questions';
import Reviews from '../../screens/App/Reviews';
import UserProfile from '../../screens/App/Profiles/UserProfile';
import Followers from '../../screens/App/Profiles/Followers';
import Notifications from '../../screens/App/Feed/Notifications';
import Products from '../../screens/App/Products';
import ShareInWillow from '../../screens/App/ShareInWillow';
import WillowWebView from '../../screens/WillowWebView';

const noHeader = { headerShown: false };

const FeedStacks = () => {
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
        <Stack.Navigator screenOptions={{ headerShown: true, gestureEnabled: true }}>
            <Stack.Screen name={Constants.FEEDS} component={Feed} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.CREATE_TIP} component={CreateTip} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.CREATE_QUESTION} component={CreateQuestion} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.CREATE_REVIEW} component={CreateReview} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.TEXT_INPUT} component={TextInput} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.TIP_INPUT} component={TipInput} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.TIPS} component={Tips} options={noHeader} />
            <Stack.Screen name={Constants.QUESTIONS} component={Questions} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.USER_PROFILE} component={UserProfile} options={noHeader} />
            <Stack.Screen name={Constants.FOLLOWERS} component={Followers} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.NOTIFICATIONS} component={Notifications} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.SEARCH_PRODUCT} component={SearchProduct} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.PRODUCT} component={Products} options={noHeader} />
            <Stack.Screen name={Constants.REVIEWS} component={Reviews} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.SHARE_IN_WILLOW} component={ShareInWillow} options={defaultScreenOptions} />
            <Stack.Screen name={Constants.WEBVIEW} component={WillowWebView} options={defaultScreenOptions} />
        </Stack.Navigator>
    );
};

export default FeedStacks;
