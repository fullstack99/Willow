import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../../../constants';
import PollOption from './PollOption';
import MultipleTouchable from '../../MultipleTouchable';
import FirebaseChatMessage from '../../../service/firebase_requests/ChatMessage';

const Poll = ({ navigation, myself, room, message, openMessageActionDialog, openMessageLikesDialog }) => {
    const [options, setOptions] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const voted = message.voted.indexOf(user?.uid) !== -1 || message?.ended;

    useEffect(() => {
        const onOptionsSnapshot = (querySnapshot) => {
            setOptions(
                querySnapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() };
                }),
            );
        };
        const unsubscribe = FirebaseChatMessage.initChatPollOptionsListener(room.id, message.id, onOptionsSnapshot, console.log);

        return unsubscribe;
    }, [room?.id, message?.id]);

    return (
        <MultipleTouchable
            style={[styles.container, { backgroundColor: myself ? colors.LIGHT_PRIMARY_COLOR : colors.GREY }]}
            onLongPress={() => openMessageActionDialog(message)}
            disabled={!myself}>
            <View>
                <Text style={styles.question}>{message?.question || ''}</Text>
                <View style={styles.optionsContainer}>
                    {options.map((option) => (
                        <PollOption
                            key={option.id}
                            myself={myself}
                            option={option}
                            roomID={room.id}
                            messageID={message.id}
                            voted={voted}
                            totalVotes={message.totalVotes || 0}
                            anonymous={message.anonymous}
                        />
                    ))}
                </View>
                <View style={styles.actionsContainer}>
                    {voted ? (
                        <TouchableOpacity
                            disabled={message?.ended}
                            onPress={() => FirebaseChatMessage.voteInPoll(room.id, message.id)}>
                            <Text style={styles.retractVote}>{message?.ended ? `poll ended` : `retract vote`}</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.activePoll}>please vote</Text>
                    )}
                    <Text style={styles.vote}>
                        {message?.totalVotes || 0} {message?.totalVotes === 1 ? 'vote' : 'votes'}
                    </Text>
                </View>
            </View>
        </MultipleTouchable>
    );
};

Poll.defaultProps = {
    myself: false,
};

export default Poll;

const styles = StyleSheet.create({
    container: {
        maxWidth: '100%',
        minWidth: '100%',
        padding: 15,
        borderRadius: 15,
    },
    question: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
    optionsContainer: {
        marginVertical: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    vote: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.GREY_1,
    },
    retractVote: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 14,
        color: colors.GREY_1,
    },
    activePoll: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.GREY_1,
    },
});
