import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../../../constants';
import * as DATABASE_CONSTANTS from '../../../constants/Database';
import * as NAVIGATOR_CONSTANTS from '../../../navigator/constants';
import CustomFastImage from '../../App/CustomFastImage';
import FirebaseChat from '../../../service/firebase_requests/Chat';
import FirebaseFeed from '../../../service/firebase_requests/Feed';
import FirebaseUser from '../../../service/firebase_requests/User';
import MultipleTouchable from '../../MultipleTouchable';
import MessageLikes from './MessageLikes';
import UnavailableContent from './UnavailableContent';

const SharedItem = ({ navigation, product, myself, room, message, openMessageActionDialog, openMessageLikesDialog }) => {
    const user = useSelector((state) => state.auth.user);
    if (!product) {
        return <UnavailableContent myself={myself} message={`this shared item is no longer available`} />;
    }
    const _navigateToProduct = () => {
        navigation &&
            navigation.navigate(NAVIGATOR_CONSTANTS.FEED, {
                screen: NAVIGATOR_CONSTANTS.PRODUCT,
                initial: false,
                params: { productID: product.asin },
            });
    };
    const onDoubleTap = () => {
        if (!room.id || !message || !message.id || !Array.isArray(message.likes) || message.user === user?.uid) return;
        FirebaseChat.likeMessage(room.id, message.id, message.likes.indexOf(user?.uid) === -1);
    };
    return (
        <View>
            <MessageLikes myself={myself} type={room.type} message={message} openMessageLikesDialog={openMessageLikesDialog} />
            <MultipleTouchable
                onSingleTap={_navigateToProduct}
                onDoubleTap={onDoubleTap}
                onLongPress={() => openMessageActionDialog(message)}>
                <View style={styles.container}>
                    <View style={styles.top}>
                        <CustomFastImage
                            maxHeight={Dimensions.get('window').height}
                            maxWidth={Dimensions.get('window').width * 0.5}
                            source={{ uri: product?.main_image?.link || (Array.isArray(product?.images) && product?.images[0]) }}
                            imageStyle={{ borderTopRightRadius: 25, borderTopLeftRadius: 25 }}
                        />
                    </View>
                    <View style={styles.bottom}>
                        <Text style={styles.postTitle}>{product.title}</Text>
                    </View>
                </View>
            </MultipleTouchable>
        </View>
    );
};

export default SharedItem;

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        borderWidth: 1,
        borderColor: colors.GREY,
    },
    top: {},
    bottom: {
        padding: 10,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        maxWidth: Dimensions.get('window').width * 0.5,
    },
    postTitle: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 16,
    },
});
