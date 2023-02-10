import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { fonts, colors } from '../../constants';

import BrowseForumSvg from '../../assets/Images/chatting/browse_public_forum.svg';
import DirectGroupSvg from '../../assets/Images/chatting/direct_group_chat.svg';
import NewForumSvg from '../../assets/Images/chatting/new_public_forum.svg';

const CreateChatDialog = ({ onClose, onDirectChat, onNewPublicForum, onBrowsePublicForum, chatRef }) => {
    return (
        <RBSheet
            ref={chatRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <TouchableOpacity onPress={onDirectChat} style={styles.item}>
                <View style={styles.svg}>
                    <DirectGroupSvg />
                </View>
                <Text style={styles.text}>new private chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNewPublicForum} style={styles.item}>
                <View style={styles.svg}>
                    <NewForumSvg />
                </View>
                <Text style={styles.text}>new public chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onBrowsePublicForum} style={styles.item}>
                <View style={styles.svg}>
                    <BrowseForumSvg />
                </View>
                <Text style={styles.text}>browse public chats</Text>
            </TouchableOpacity>
        </RBSheet>
    );
};

export default CreateChatDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 300,
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
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    svg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.WHITE_2,
    },
});
