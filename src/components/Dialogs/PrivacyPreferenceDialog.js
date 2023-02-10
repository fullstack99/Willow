import React from 'react';
import { StyleSheet, Text, View, Dimensions, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import PublicIcon from '../../assets/Images/Profile/public.svg';
import PrivateIcon from '../../assets/Images/Profile/private.svg';

const { height, width } = Dimensions.get('window');

const PrivacyPreferenceDialog = ({ forwardRef, privacy_preference, setPrivacyPreference }) => {
    if (!forwardRef) return null;
    const insets = useSafeAreaInsets();

    const togglePrivacy = () => {
        setPrivacyPreference(privacy_preference === 'public' ? 'private' : 'public');
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
            <View style={[GlobalStyles.alignCenterContainer, { marginBottom: insets.bottom + 20, width: '100%' }]}>
                <Text style={styles.title}>privacy preference</Text>

                <View style={styles.container}>
                    {privacy_preference === 'public' ? <PublicIcon /> : <PrivateIcon />}
                    <Text style={styles.subTitle}>{privacy_preference}</Text>
                    <Switch
                        trackColor={{ false: colors.GREY, true: colors.PRIMARY_COLOR }}
                        onValueChange={togglePrivacy}
                        value={privacy_preference === 'public'}
                    />
                </View>
            </View>
        </RBSheet>
    );
};

export default PrivacyPreferenceDialog;

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
