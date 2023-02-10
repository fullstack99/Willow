import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import { SIGNUP_I, SIGNUP_II, TURN_ON_NOTIFICATIONS } from '../constants';
import SignUpI from '../../screens/Auth/SignupI';
import SignUpII from '../../screens/Auth/SignupII';
import TurnOnNotifications from '../../screens/Auth/TurnOnNotifications';

import { colors, fonts } from '../../constants';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

const SignupStacks = () => {
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
        headerLeft: ({ onPress }) => (
            <FontAwesome
                style={{
                    marginLeft: 20,
                    alignItems: 'center',
                }}
                size={30}
                name={'angle-left'}
                onPress={onPress}
            />
        ),
    };

    return (
        <Stack.Navigator initialRouteName={SIGNUP_I}>
            <Stack.Screen name={SIGNUP_I} component={SignUpI} options={{ title: 'sign up', ...defaultScreenOptions }} />
            <Stack.Screen
                name={SIGNUP_II}
                component={SignUpII}
                options={{
                    title: 'sign up',
                    ...defaultScreenOptions,
                }}
            />
            <Stack.Screen
                name={TURN_ON_NOTIFICATIONS}
                component={TurnOnNotifications}
                options={{ headerShown: false, headerLeft: null, gestureEnabled: false }}
            />
        </Stack.Navigator>
    );
};

export default SignupStacks;
