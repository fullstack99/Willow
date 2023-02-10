import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import CustomFastImage from '../App/CustomFastImage';
import { fonts, colors } from '../../constants';
import MessageIcon from '../../assets/Images/iMessage-icon.svg';
import WillowIcon from '../../assets/Images/willow-icon.png';

const ItemShareDialog = ({ forwardRef, navigation, onMessagePress, onWillowPress }) => {
    const insets = useSafeAreaInsets();
    const user = useSelector((state) => state.auth.user);
    const options = [
        {
            key: 'message',
            icon: <MessageIcon />,
            label: 'message',
            onPress: () => onMessagePress && onMessagePress(),
        },
        {
            key: 'willow',
            icon: <CustomFastImage source={WillowIcon} maxWidth={50} maxHeight={50} borderRadius={50 / 2} />,
            label: 'willow',
            onPress: () => onWillowPress && onWillowPress(),
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

export default ItemShareDialog;

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
