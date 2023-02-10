import React from 'react';
import PropType from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '../../constants';
import { TIPS, QUESTIONS, REVIEWS } from '../../constants/Database';
import ReadMore from '../ReadMore';

const FeedCardTitle = ({ data, numberOfLines }) => {
    if (!data.type) return <View />;
    else {
        switch (data.type) {
            case TIPS:
            case REVIEWS:
                return (
                    <ReadMore numberOfLines={numberOfLines}>
                        <Text style={styles.title}>{data.title}</Text>
                    </ReadMore>
                );
            case QUESTIONS:
                return (
                    <ReadMore numberOfLines={numberOfLines}>
                        <Text style={styles.title}>{data.question}</Text>
                    </ReadMore>
                );
            default:
                return <View />;
        }
    }
};

FeedCardTitle.propTypes = {
    data: PropType.shape({
        type: PropType.string.isRequired,
        title: PropType.string,
        comment: PropType.string,
        question: PropType.string,
    }),
    numberOfLines: PropType.number,
};

export default FeedCardTitle;

const styles = StyleSheet.create({
    title: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 20,
    },
});
