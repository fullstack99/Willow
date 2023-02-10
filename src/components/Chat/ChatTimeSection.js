import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';
import { colors, fonts } from '../../constants';

const ChatTimeSection = ({ currMsg, prevMsg, index }) => {
    const [enable, setEnable] = useState(false);
    const [timestamp, setTimestamp] = useState(null);

    useEffect(() => {
        if ((index === 0 && !prevMsg) || !prevMsg) {
            const currMessageDate = moment(currMsg?.created_at?.toDate()).startOf('day');
            setEnable(true);
            setTimestamp(currMessageDate);
        } else if (currMsg && prevMsg) {
            const prevMessageDate = moment(prevMsg?.created_at?.toDate()).startOf('day');
            const currMessageDate = moment(currMsg?.created_at?.toDate()).startOf('day');
            const dateDiff = moment.duration(currMessageDate.diff(prevMessageDate)).asDays();
            setEnable(dateDiff > 0);
            setTimestamp(currMessageDate);
        } else {
            setEnable(false);
            setTimestamp(null);
        }
    }, [currMsg, prevMsg]);

    if (!enable || !timestamp) return null;
    return (
        <View style={styles.container}>
            <Text style={styles.timestamp}>
                {moment(timestamp)
                    .calendar(null, {
                        // when the date is closer, specify custom values
                        lastWeek: '[last] dddd',
                        lastDay: '[yesterday]',
                        sameDay: '[today]',
                        nextDay: '[tomorrow]',
                        nextWeek: 'dddd',
                        // when the date is further away, use from-now functionality
                        sameElse: () => 'dddd, MM/DD/YYYY',
                    })
                    .toLowerCase()}
            </Text>
        </View>
    );
};

export default ChatTimeSection;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    timestamp: {
        fontFamily: fonts.MULISH_REGULAR,
        color: colors.DARK_GREY,
    },
});
