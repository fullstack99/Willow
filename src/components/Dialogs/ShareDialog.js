import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import { fonts, colors } from '../../constants';
import MessageIcon from '../../assets/Images/iMessage-icon.svg';
import MailIcon from '../../assets/Images/mail-icon.svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ShareDialog = ({ forwardRef, navigation, onMessagePress, onMailPress, onQRCodePress }) => {
    const insets = useSafeAreaInsets();
    const options = [
        {
            key: 'message',
            icon: <MessageIcon />,
            label: 'message',
            onPress: () => onMessagePress && onMessagePress(),
        },
        {
            key: 'mail',
            icon: <MailIcon />,
            label: 'mail',
            onPress: () => onMailPress && onMailPress(),
        },
        {
            key: 'qrcode',
            icon: (
                <View
                    style={{
                        height: 50,
                        width: 50,
                        borderRadius: 50 / 2,
                        backgroundColor: colors.PRIMARY_COLOR,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <FontAwesome name="qrcode" size={25} color={colors.WHITE} />
                </View>
            ),
            label: 'QR code',
            onPress: () => onQRCodePress && onQRCodePress(),
        },
    ];
    return (
        <RBSheet
            ref={forwardRef}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: { ...styles.dialogContainer, paddingBottom: insets.bottom },
            }}>
            <View style={styles.container}>
                <Text style={styles.title}>share via</Text>
                <View style={styles.sectionContainer}>
                    {options.map((option) => (
                        <TouchableOpacity key={option.key} onPress={option.onPress}>
                            <View style={styles.itemContainer}>
                                {option.icon}
                                <Text style={styles.label}>{option.label}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </RBSheet>
    );
};

ShareDialog.propTypes = {
    forwardRef: PropTypes.object.isRequired,
    navigation: PropTypes.object,
    onMessagePress: PropTypes.func,
    onMailPress: PropTypes.func,
    onQRCodePress: PropTypes.func,
};

export default ShareDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 200,
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        marginBottom: 20,
    },
    sectionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    itemContainer: {
        alignItems: 'center',
    },
    label: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        paddingTop: 10,
    },
});
