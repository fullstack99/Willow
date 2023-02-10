import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { fonts, colors } from '../../constants';
import CopySvg from '../../assets/Images/copy_2.svg';
import ShareSvg from '../../assets/Images/share_2.svg';
import BlocklistSvg from '../../assets/Images/blocklist.svg';
import ReplySvg from '../../assets/Images/reply.svg';

const ImageDialog = ({ forwardRef, handleDeleteImage, handleLikeImage, handleReplyImage, selectedImage }) => {
    const { user } = useSelector((state) => state.auth);
    const liked = selectedImage?.likes?.indexOf(user?.uid) !== -1 || false;
    return (
        <RBSheet
            ref={forwardRef}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            {selectedImage?.user.uid !== user?.uid && (
                <TouchableOpacity onPress={handleLikeImage} style={styles.item}>
                    <View style={styles.heartContainer}>
                        <FontAwesome name={liked ? 'heart-o' : 'heart'} size={20} color={liked ? colors.BLACK : colors.RED} />
                    </View>
                    <Text style={styles.text}>{liked ? 'unlike' : 'like'}</Text>
                </TouchableOpacity>
            )}
            {selectedImage?.user.uid === user.uid && (
                <TouchableOpacity onPress={handleDeleteImage} style={styles.item}>
                    <BlocklistSvg />
                    <Text style={styles.text}>delete</Text>
                </TouchableOpacity>
            )}
        </RBSheet>
    );
};

export default ImageDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        height: 200,
    },
    text: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
        fontWeight: '600',
        color: colors.BLACK,
        marginLeft: 15,
    },
    item: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    heartContainer: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        backgroundColor: colors.GREY,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
