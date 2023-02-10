import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import {
    CHATS,
    NEW_CHAT,
    NEW_PUBLIC_FORUM,
    CHATTING,
    ADD_FRIEND,
    CONTACT_LIST,
    CHAT_SETTING,
    DIRECT_MESSAGE_SETTING,
    PRIVATE_GROUP_SETTING,
    CHATTING_MEMBERS,
    PRIVACY,
    APP_CONTENT,
    SHARED_MEDIA,
    PUBLIC_FORUM,
    NEW_POLL,
    USER_PROFILE,
    MY_PROFILE,
    ADD_ROOM_MEMBERS,
    WEBVIEW,
} from '../constants';
import ChatRooms from '../../screens/App/Chats/ChatRooms';
import NewChat from '../../screens/App/Chats/NewChat';
import NewPublicForum from '../../screens/App/Chats/NewPublicForum';
import ChatRoom from '../../screens/App/Chats/ChatRoom';
import ContactList from '../../screens/App/chat/ContactList';
import ChatRoomSetting from '../../screens/App/Chats/Settings/ChatRoomSetting';
import DirectMessageSetting from '../../screens/App/Chats/Settings/Private/DirectMessageSetting';
import PrivateGroupSetting from '../../screens/App/Chats/Settings/Private/PrivateGroupSetting';
import AddRoomMembers from '../../screens/App/Chats/Settings/AddRoomMembers';
// import Setting from '../../screens/App/chat/setting/Setting';
import ChatRoomMembers from '../../screens/App/Chats/Settings/ChatRoomMembers';
// import Members from '../../screens/App/chat/setting/Members';
import Privacy from '../../screens/App/chat/setting/Privacy';
import BrowsePublicForum from '../../screens/App/Chats/BrowsePublicForum';
import CreatePoll from '../../screens/App/Chats/CreatePoll';
import AppContent from '../../screens/App/chat/content/AppContent';
import SharedMedia from '../../screens/App/Chats/Media/SharedMedia';
import MyProfile from '../../screens/App/Profiles/MyProfile';
import UserProfile from '../../screens/App/Profiles/UserProfile';
import AddFriend from '../../screens/App/AddFriend';
import WillowWebView from '../../screens/WillowWebView';
import { colors, fonts } from '../../constants';
import HeaderIcon from '../../components/App/HeaderIcon';

const noHeader = { headerShown: false };
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
    headerLeft: ({ onPress }) => <HeaderIcon onPress={onPress} />,
};

const ChatStacks = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: true, gestureEnabled: true }} initialRouteName={CHATS}>
            <Stack.Screen name={CHATS} component={ChatRooms} options={{ ...defaultScreenOptions, title: 'chat' }} />
            <Stack.Screen name={NEW_CHAT} component={NewChat} options={{ ...defaultScreenOptions, title: 'new private chat' }} />
            <Stack.Screen
                name={NEW_PUBLIC_FORUM}
                component={NewPublicForum}
                options={{ ...defaultScreenOptions, title: 'new public chat' }}
            />
            <Stack.Screen
                name={PUBLIC_FORUM}
                component={BrowsePublicForum}
                options={{ ...defaultScreenOptions, title: 'browse public chats' }}
            />
            <Stack.Screen name={CHATTING} component={ChatRoom} options={defaultScreenOptions} />
            <Stack.Screen name={CONTACT_LIST} component={ContactList} options={noHeader} />
            <Stack.Screen name={CHAT_SETTING} component={ChatRoomSetting} options={defaultScreenOptions} />
            <Stack.Screen name={DIRECT_MESSAGE_SETTING} component={DirectMessageSetting} options={defaultScreenOptions} />
            <Stack.Screen name={PRIVATE_GROUP_SETTING} component={PrivateGroupSetting} options={defaultScreenOptions} />
            <Stack.Screen name={ADD_ROOM_MEMBERS} component={AddRoomMembers} options={defaultScreenOptions} />
            <Stack.Screen
                name={CHATTING_MEMBERS}
                component={ChatRoomMembers}
                options={{ ...defaultScreenOptions, title: 'members' }}
            />
            <Stack.Screen name={PRIVACY} component={Privacy} options={noHeader} />
            <Stack.Screen name={APP_CONTENT} component={AppContent} options={noHeader} />
            <Stack.Screen
                name={SHARED_MEDIA}
                component={SharedMedia}
                options={{ ...defaultScreenOptions, title: 'shared media' }}
            />
            <Stack.Screen name={NEW_POLL} component={CreatePoll} options={{ ...defaultScreenOptions, title: 'new poll' }} />
            <Stack.Screen name={USER_PROFILE} component={UserProfile} options={noHeader} />
            <Stack.Screen name={MY_PROFILE} component={MyProfile} options={noHeader} />
            <Stack.Screen
                name={ADD_FRIEND}
                component={AddFriend}
                options={{
                    ...defaultScreenOptions,
                    title: 'add friend',
                }}
            />
            <Stack.Screen name={WEBVIEW} component={WillowWebView} options={defaultScreenOptions} />
        </Stack.Navigator>
    );
};

export default ChatStacks;
