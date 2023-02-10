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
import StarSvg from '../../assets/Images/star-black.svg';

const MessageActionsDialog = ({
    forwardRef,
    handleDeleteMessage,
    handleEditMessage,
    handleCopyMessage,
    handleLikeMessage,
    handleReplyMessage,
    handleEndPoll,
    selectedMessage,
}) => {
    const { user } = useSelector((state) => state.auth);
    const liked = selectedMessage?.likes?.indexOf(user?.uid) !== -1 || false;
    const editable =
        selectedMessage?.type !== 'share_post' && selectedMessage?.type !== 'share_item' && selectedMessage?.type !== 'poll';
    const replyable =
        selectedMessage?.type !== 'share_post' && selectedMessage?.type !== 'share_item' && selectedMessage?.type !== 'poll';
    const copyable =
        selectedMessage?.type !== 'share_post' && selectedMessage?.type !== 'share_item' && selectedMessage?.type !== 'poll';
    return (
        <RBSheet
            ref={forwardRef}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: { ...styles.dialogContainer, height: editable && replyable && copyable ? 350 : 250 },
            }}>
            {selectedMessage?.user.uid !== user?.uid ? (
                <TouchableOpacity onPress={handleLikeMessage} style={styles.item}>
                    <View style={styles.heartContainer}>
                        <FontAwesome name={liked ? 'heart-o' : 'heart'} size={20} color={liked ? colors.BLACK : colors.RED} />
                    </View>
                    <Text style={styles.text}>{liked ? 'unlike' : 'like'}</Text>
                </TouchableOpacity>
            ) : null}
            {selectedMessage?.type === 'poll' && !selectedMessage?.ended && (
                <TouchableOpacity onPress={handleEndPoll} style={styles.item}>
                    <BlocklistSvg />
                    <Text style={styles.text}>end poll</Text>
                </TouchableOpacity>
            )}
            {selectedMessage?.user.uid === user.uid ? (
                <>
                    {editable && (
                        <TouchableOpacity onPress={handleEditMessage} style={styles.item}>
                            <ShareSvg />
                            <Text style={styles.text}>edit</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={handleDeleteMessage} style={styles.item}>
                        <BlocklistSvg />
                        <Text style={styles.text}>delete {selectedMessage?.type === 'poll' && 'poll'}</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    {replyable && (
                        <TouchableOpacity onPress={handleReplyMessage} style={styles.item}>
                            <ReplySvg />
                            <Text style={styles.text}>reply</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}

            {copyable && (
                <TouchableOpacity onPress={handleCopyMessage} style={styles.item}>
                    <CopySvg />
                    <Text style={styles.text}>copy</Text>
                </TouchableOpacity>
            )}
        </RBSheet>
    );
};

export default MessageActionsDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
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
