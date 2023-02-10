import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../../constants';
import DirectChatRoomTab from './Private/Direct/DirectChatRoomTab';
import ForumChatRoomTab from './Public/ForumChatRoomTab';
import GroupChatRoomTab from './Private/Group/GroupChatRoomTab';

const ChatRoomListItem = (props) => {
    const { user } = useSelector((state) => state.auth);
    const { room } = props;

    switch (room.type) {
        case 'direct_message':
            return <DirectChatRoomTab {...props} />;
        case 'public_forum':
            return <ForumChatRoomTab {...props} />;
        case 'private_group':
            return <GroupChatRoomTab {...props} />;
        default:
            return;
    }
};

export default ChatRoomListItem;
