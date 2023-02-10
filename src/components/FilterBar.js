import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../constants';
import * as DATABASE_CONSTANTS from '../constants/Database';
import Pencil from '../assets/Images/Feed/pencil.svg';
import Star from '../assets/Images/Feed/star.svg';
import Questions from '../assets/Images/Feed/questions.svg';
import QuestionsWhite from '../assets/Images/Feed/questions_white.svg';

const slides = [
    {
        key: 'ALL',
        title: 'all',
    },
    {
        key: DATABASE_CONSTANTS.TIPS,
        title: 'tips',
    },
    {
        key: DATABASE_CONSTANTS.REVIEWS,
        title: 'reviews',
    },
    {
        key: DATABASE_CONSTANTS.QUESTIONS,
        title: 'questions',
    },
];

const FilterBar = (props) => {
    const { selected, onChange, disabled } = props;

    const _renderIcon = (key, sameKey) => {
        switch (key) {
            case DATABASE_CONSTANTS.TIPS:
                return <Pencil style={[styles.buttonIcon, { color: sameKey ? colors.WHITE : colors.PRIMARY_COLOR }]} />;
            case DATABASE_CONSTANTS.REVIEWS:
                return <Star style={[styles.buttonIcon, { color: sameKey ? colors.WHITE : colors.PRIMARY_COLOR }]} />;
            case DATABASE_CONSTANTS.QUESTIONS:
                return sameKey ? <QuestionsWhite style={styles.buttonIcon} /> : <Questions style={styles.buttonIcon} />;
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container]}>
            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                keyExtractor={(item) => item.key.toString()}
                data={slides}
                renderItem={({ item }) => {
                    const sameKey = selected === item.key;
                    return (
                        <TouchableOpacity
                            style={[
                                styles.buttonContainer,
                                {
                                    backgroundColor: sameKey ? colors.PRIMARY_COLOR : colors.GREY,
                                },
                            ]}
                            disabled={disabled}
                            onPress={() => onChange(item.key)}>
                            {_renderIcon(item.key, sameKey)}
                            <Text
                                style={[
                                    styles.buttonText,
                                    {
                                        color: sameKey ? colors.WHITE : colors.BLACK,
                                    },
                                ]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

FilterBar.defaultProps = {
    selected: 'ALL',
};

FilterBar.propTypes = {
    selected: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default FilterBar;

const styles = StyleSheet.create({
    container: {
        height: 80,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonContainer: {
        borderRadius: 50,
        paddingHorizontal: 25,
        marginVertical: 15,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonIcon: {
        marginRight: 15,
    },
    buttonText: {
        alignItems: 'center',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
    },
});
