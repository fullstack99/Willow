import React from 'react';
import { StyleSheet, Text, View, Dimensions, Switch } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import Button from '../Button';
import User from '../../service/firebase_requests/User';
import FirebaseErrors from '../../service/firebase_errors';
import NotificationBell from '../../assets/Images/Profile/notification.svg';
const { height, width } = Dimensions.get('window');

const FollowingDialog = ({ forwardRef, user, loading, setError }) => {
    if (!forwardRef || !user) return null;
    const muted = useSelector((state) => state.auth?.muted || []);
    const insets = useSafeAreaInsets();

    const toggleMuted = () => {
        User.muteUserByID(user.uid).catch((error) => FirebaseErrors.setError(error, setError));
    };

    const unfollowOnPress = () => {
        User.unfollowUserById(user.uid)
            .catch((error) => FirebaseErrors.setError(error, setError))
            .finally(() => forwardRef && forwardRef.current.close());
    };

    return (
        <RBSheet
            ref={forwardRef}
            height={height * 0.35}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: GlobalStyles.dialogContainer,
            }}>
            <View
                style={[
                    GlobalStyles.alignCenterContainer,
                    { marginBottom: insets.bottom + 20, width: '100%', justifyContent: 'center' },
                ]}>
                <Text style={styles.title}>following</Text>

                <View style={styles.container}>
                    <NotificationBell />
                    <Text style={styles.subTitle}>notifications</Text>
                    <Switch
                        trackColor={{ false: colors.GREY, true: colors.PRIMARY_COLOR }}
                        onValueChange={toggleMuted}
                        value={muted?.findIndex((m) => m.uid === user.uid) === -1}
                    />
                </View>

                <Button
                    onPress={unfollowOnPress}
                    disabled={loading}
                    disabledColor={colors.GREY}
                    style={{ backgroundColor: '#FFE3E4' }}
                    textStyle={{ color: '#FF5A61' }}>
                    unfollow
                </Button>
            </View>
        </RBSheet>
    );
};

export default FollowingDialog;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        marginVertical: 20,
    },
    container: {
        flexDirection: 'row',
        marginHorizontal: 30,
        alignItems: 'center',
    },
    subTitle: {
        flex: 1,
        marginLeft: 15,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
});
