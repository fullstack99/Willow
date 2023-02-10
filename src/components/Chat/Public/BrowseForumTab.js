import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import FirebasePublicForumChat from '../../../service/firebase_requests/PublicForumChat';
import FirebaseErrors from '../../../service/firebase_errors';
import { CHATTING } from '../../../navigator/constants';
import { colors, fonts } from '../../../constants';
import CheckSvg from '../../../assets/Images/check-small.svg';
import JoinSvg from '../../../assets/Images/add_product.svg';

const BrowseForumTab = ({ navigation, forum, setError, setLoading }) => {
    const user = useSelector((state) => state.auth.user);
    const hasJoined = forum.members.indexOf(user?.uid) !== -1 || false;
    const [hasRequested, setHasRequested] = useState(false);

    useEffect(() => {
        let unsubscribe;
        if (!hasJoined && forum?.adminApprove) {
            unsubscribe = FirebasePublicForumChat.checkJoinRequestStatus(
                forum.id,
                (querySnapshot) => setHasRequested(querySnapshot.size > 0),
                (error) => FirebaseErrors.setError(error, setError),
            );
        }
        return () => unsubscribe && unsubscribe();
    });

    const navigateToChatRoom = () => {
        navigation && navigation.push(CHATTING, { room: forum });
    };

    const onForumClick = () => {
        if (hasJoined) {
            return FirebasePublicForumChat.updateForumShow(forum.id)
                .then(navigateToChatRoom)
                .catch((error) => FirebaseErrors.setError(error, setError));
        } else {
            return navigation && navigation.push(CHATTING, { room: forum });
        }
    };

    const onJoinForumClick = () => {
        if (hasJoined) {
            return FirebasePublicForumChat.updateForumShow(forum.id)
                .then(navigateToChatRoom)
                .catch((error) => FirebaseErrors.setError(error, setError));
        } else if (forum.adminApprove) {
            setLoading(true);
            return FirebasePublicForumChat.requestToJoinForum(forum.id)
                .catch((error) => (setError ? FirebaseErrors.setError(error, setError) : console.log(error)))
                .finally(() => setLoading(false));
        } else {
            setLoading(true);
            return FirebasePublicForumChat.joinForum(forum.id)
                .then(navigateToChatRoom)
                .catch((error) => (setError ? FirebaseErrors.setError(error, setError) : console.log(error)))
                .finally(() => setLoading(false));
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onForumClick}>
            <FastImage source={{ uri: forum?.avatar_url }} style={styles.avatar} resizeMode={FastImage.resizeMode.contain} />
            <Text style={styles.name}>{forum.name}</Text>
            {hasJoined ? (
                <CheckSvg height={30} width={30} />
            ) : (
                <TouchableOpacity onPress={onJoinForumClick}>
                    <JoinSvg height={30} width={30} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

export default BrowseForumTab;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    name: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
});
