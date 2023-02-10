import React from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import * as constants from '../constants';
import { colors, fonts } from '../../constants';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import HeaderIcon from '../../components/App/HeaderIcon';
import Startup from '../../screens/Auth/Startup';
import Login from '../../screens/Auth/Login';
import SignupStacks from '../Auth/SignupStacks';
import MyProfile from '../../screens/App/Profiles/MyProfile';
import Settings from '../../screens/App/Profiles/Settings';
import Account from '../../screens/App/Profiles/Account';
import Status from '../../screens/App/Profiles/Status';
import BunOven from '../../screens/App/Profiles/BunOven';
import AboutChildren from '../../screens/App/Profiles/AboutChildren';
import Notifications from '../../screens/App/Profiles/Notifications';
import Blocklist from '../../screens/App/Profiles/Blocklist';
import UserProfile from '../../screens/App/Profiles/UserProfile';
import AddFriend from '../../screens/App/AddFriend';
import Followers from '../../screens/App/Profiles/Followers';
import Tips from '../../screens/App/Tips';
import Questions from '../../screens/App/Questions';
import Reviews from '../../screens/App/Reviews';
import Products from '../../screens/App/Products';
import Bookmarked from '../../screens/App/Profiles/Bookmarked';
import Support from '../../screens/App/Profiles/Support';
import Share from '../../screens/App/Profiles/Share';
import WillowWebView from '../../screens/WillowWebView';
import QuickFriend from '../../screens/App/Profiles/QuickFriend';

const noHeader = { headerShown: false };
const defaultScreenOptions = {
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
    headerLeft: ({ onPress }) => <HeaderIcon onPress={onPress} />,
};

const ProfileStacks = (props) => {
    const { user } = props;
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: true, gestureEnabled: true }}
            initialRouteName={user && user.uid ? constants.MY_PROFILE : constants.START_UP}>
            <Stack.Screen name={constants.WEBVIEW} component={WillowWebView} options={defaultScreenOptions} />
            <Stack.Screen name={constants.LOGIN} component={Login} options={{ title: 'login', ...defaultScreenOptions }} />
            <Stack.Screen name={constants.START_UP} component={Startup} options={noHeader} />
            <Stack.Screen name={constants.MY_PROFILE} component={MyProfile} options={noHeader} />
            <Stack.Screen name={constants.USER_PROFILE} component={UserProfile} options={noHeader} />
            <Stack.Screen name={constants.SIGNUP} component={SignupStacks} options={noHeader} />
            <Stack.Screen
                name={constants.SETTINGS}
                component={Settings}
                options={{ title: 'settings', ...defaultScreenOptions }}
            />
            <Stack.Screen name={constants.ACCOUNT} component={Account} options={{ title: 'account', ...defaultScreenOptions }} />
            <Stack.Screen name={constants.STATUS} component={Status} options={{ title: 'status', ...defaultScreenOptions }} />
            <Stack.Screen name={constants.BUN_OVEN} component={BunOven} options={{ gestureEnabled: false, ...noHeader }} />
            <Stack.Screen
                name={constants.ABOUT_CHILDREN}
                component={AboutChildren}
                options={{ gestureEnabled: false, ...noHeader }}
            />
            <Stack.Screen
                name={constants.NOTIFICATION_SETTINGS}
                component={Notifications}
                options={{ title: 'push notifications', ...defaultScreenOptions }}
            />
            <Stack.Screen
                name={constants.BLOCKLIST}
                component={Blocklist}
                options={{ title: 'blocked', ...defaultScreenOptions }}
            />
            <Stack.Screen
                name={constants.PROFILE_ADD_FRIEND}
                component={AddFriend}
                options={{
                    title: 'add friends',
                    ...defaultScreenOptions,
                }}
            />
            <Stack.Screen name={constants.FOLLOWERS} component={Followers} options={defaultScreenOptions} />
            <Stack.Screen name={constants.TIPS} component={Tips} options={noHeader} />
            <Stack.Screen name={constants.QUESTIONS} component={Questions} options={defaultScreenOptions} />
            <Stack.Screen name={constants.REVIEWS} component={Reviews} options={defaultScreenOptions} />
            <Stack.Screen name={constants.PRODUCT} component={Products} options={defaultScreenOptions} />
            <Stack.Screen
                name={constants.BOOKMARKED}
                component={Bookmarked}
                options={{ title: 'bookmarked', ...defaultScreenOptions }}
            />
            <Stack.Screen name={constants.SUPPORT} component={Support} options={{ title: 'support', ...defaultScreenOptions }} />
            <Stack.Screen
                name={constants.SHARE}
                component={Share}
                options={{ title: 'share the app', ...defaultScreenOptions }}
            />
            <Stack.Screen
                name={constants.QUICK_FRIEND}
                component={QuickFriend}
                options={{ title: 'quick friend', ...defaultScreenOptions }}
            />
        </Stack.Navigator>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileStacks);
