import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { fonts, colors } from '../../../constants';
import MessageTimestampSkeleton from '../Skeleton/MessageTimestampSkeleton';

const MessageTimestamp = ({ myself, created_at }) => {
    if (!created_at || !created_at?.toDate) return <MessageTimestampSkeleton />;
    return (
        <View style={styles.container}>
            <Text style={[styles.timestamp, { textAlign: myself ? 'right' : 'left' }]}>
                {moment(created_at.toDate()).format('h:mm a')}
            </Text>
        </View>
    );
};

MessageTimestamp.defaultProps = {
    myself: false,
};

MessageTimestamp.propTypes = {
    myself: PropTypes.bool.isRequired,
    created_at: PropTypes.object,
};

export default MessageTimestamp;

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
    },
    timestamp: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 9,
        color: colors.DARK_GREY,
    },
});
