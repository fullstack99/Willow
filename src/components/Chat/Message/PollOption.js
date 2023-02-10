import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../../../constants';
import FirebaseChatMessage from '../../../service/firebase_requests/ChatMessage';
import PollVotersDialog from '../PollVotersDialog';

const PollOption = ({ option, myself, voted, totalVotes, roomID, messageID, anonymous }) => {
    const precentage = totalVotes ? (option.votes.length / totalVotes) * 100 : 0;
    const user = useSelector((state) => state.auth.user);
    const pollVotersDialogRef = useRef();

    if (voted) {
        return (
            <View>
                <TouchableOpacity
                    key={option.id}
                    style={[styles.container]}
                    disabled={anonymous || option.votes.length === 0}
                    onPress={() => pollVotersDialogRef.current && pollVotersDialogRef.current.open()}>
                    <View style={styles.optionContainer}>
                        <Text
                            style={[styles.answer, { fontWeight: option.votes.indexOf(user?.uid) !== -1 ? 'bold' : 'normal' }]}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {option.answer}
                        </Text>
                        <Text
                            style={[
                                styles.precentage,
                                { fontWeight: option.votes.indexOf(user?.uid) !== -1 ? 'bold' : 'normal' },
                            ]}>
                            {precentage % 2 === 0 ? precentage.toFixed(0) : precentage.toFixed(1)}%
                        </Text>
                        <View
                            style={[
                                styles.precentageBackground,
                                {
                                    backgroundColor: myself ? colors.GREY_5 : colors.LIGHT_PRIMARY_COLOR,
                                    width: `${precentage.toString()}%`,
                                },
                            ]}
                        />
                    </View>
                </TouchableOpacity>
                <PollVotersDialog forwardRef={pollVotersDialogRef} votersID={option.votes} title={option.answer} />
            </View>
        );
    } else {
        return (
            <TouchableOpacity
                key={option.id}
                style={[styles.container]}
                onPress={() => FirebaseChatMessage.voteInPoll(roomID, messageID, option.id)}>
                <View style={[styles.optionContainer, { justifyContent: 'center' }]}>
                    <Text style={styles.answer} numberOfLines={1} ellipsizeMode="tail">
                        {option.answer}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
};

PollOption.defaultProps = {
    voted: false,
    myself: false,
    totalVotes: 0,
    anonymous: false,
};

PollOption.propTypes = {
    option: PropTypes.shape({
        id: PropTypes.string.isRequired,
        answer: PropTypes.string.isRequired,
        votes: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
    myself: PropTypes.bool.isRequired,
    roomID: PropTypes.string.isRequired,
    messageID: PropTypes.string.isRequired,
    voted: PropTypes.bool.isRequired,
    totalVotes: PropTypes.number.isRequired,
    anonymous: PropTypes.bool.isRequired,
};

export default PollOption;

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        marginBottom: 5,
        backgroundColor: colors.WHITE,
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    answer: {
        flex: 1,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        paddingLeft: 20,
        paddingVertical: 10,
        marginRight: 10,
        zIndex: 100,
    },
    precentage: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        paddingRight: 20,
        paddingVertical: 10,
        zIndex: 100,
        color: colors.PRIMARY_COLOR,
    },
    precentageBackground: {
        position: 'absolute',
        height: '100%',
        zIndex: 50,
        borderRadius: 15,
    },
});
