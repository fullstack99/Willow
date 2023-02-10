import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import Share from 'react-native-share';
import FirebaseErrors from '../../service/firebase_errors/';
import User from '../../service/firebase_requests/User';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import ShareIcon from '../../assets/Images/Profile/share.svg';
import BlockIcon from '../../assets/Images/Profile/blocklist.svg';
const { height, width } = Dimensions.get('window');

const UserSettingsDialog = ({ forwardRef, user, blocked, loading, setError, setLoading }) => {
    if (!forwardRef || !user) return null;
    const insets = useSafeAreaInsets();

    const shareOnPress = () => {
        forwardRef.current.close();
        setTimeout(() => {
            Share.open({
                title: 'Please share Willow',
                message: `Hey, would you like to try out our new app? It's Willow time! 😊`,
                url: 'https://willow.app',
                excludedActivityTypes: [],
            })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }, 500);
    };

    const blockOnPress = () => {
        if (blocked?.findIndex((b) => b.uid === user.uid) === -1) {
            setLoading(true);
            User.blockUserById(user.uid)
                .catch((err) => FirebaseErrors.setError(err, setError))
                .finally(() => {
                    setLoading(false);
                    forwardRef.current.close();
                });
        } else {
            User.unblockUserById(user.uid)
                .catch((err) => FirebaseErrors.setError(err, setError))
                .finally(() => {
                    setLoading(false);
                    forwardRef.current.close();
                });
        }
    };

    return (
        <RBSheet
            ref={forwardRef}
            height={height * 0.3}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: GlobalStyles.dialogContainer,
            }}>
            <View style={[GlobalStyles.container, { marginBottom: insets.bottom + 20, width: '100%', justifyContent: 'center' }]}>
                <TouchableOpacity style={styles.container} disabled={loading} onPress={shareOnPress}>
                    <ShareIcon />
                    <Text style={styles.subTitle}>share profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.container} disabled={loading} onPress={blockOnPress}>
                    <BlockIcon />
                    <Text style={[styles.subTitle, { color: '#FF5A61' }]}>
                        {blocked?.findIndex((b) => b.uid === user.uid) !== -1 ? 'unblock user' : 'block user'}
                    </Text>
                </TouchableOpacity>
            </View>
        </RBSheet>
    );
};

const mapStateToProps = (state) => ({
    blocked: state.auth.user?.blocked || [],
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettingsDialog);

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
        marginVertical: 10,
    },
    subTitle: {
        marginLeft: 15,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
    },
});
