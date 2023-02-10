import React from 'react';
import { connect } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { DISCOVER, FEED, PROFILE, CHAT } from '../constants';
import TabBar from '../../components/App/TabBar';
import DiscoverStacks from '../App/DiscoverStacks';
import FeedStacks from '../App/FeedStacks';
import ProfileStacks from '../App/ProfileStacks';
import ChatStacks from '../App/ChatStacks';

const defaultScreenOptions = { headerShown: false };

const AppTabs = (props) => {
    const { tabBarVisible, user } = props;
    return (
        <Tab.Navigator
            tabBar={(props) => <TabBar {...props} />}
            initialRouteName={user ? FEED : DISCOVER}
            screenOptions={{ tabBarVisible }}>
            <Tab.Screen name={FEED} component={FeedStacks} options={{ title: 'feed' }} />
            <Tab.Screen name={DISCOVER} component={DiscoverStacks} options={{ title: 'discover' }} />
            <Tab.Screen name={CHAT} component={ChatStacks} options={{ title: 'chat' }} />
            <Tab.Screen name={PROFILE} component={ProfileStacks} options={{ unmountOnBlur: true, title: 'profile' }} />
        </Tab.Navigator>
    );
};

const mapStateToProps = (state) => ({
    tabBarVisible: state.app.tabBarVisible,
    user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AppTabs);
