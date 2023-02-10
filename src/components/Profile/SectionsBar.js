import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../constants';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import * as USER_CONSTANTS from '../../constants/User';
import ShoppingBag from '../../assets/Images/Feed/shopping_bag.svg';
import Pencil from '../../assets/Images/Feed/pencil.svg';
import Star from '../../assets/Images/Feed/star.svg';
import QuestionsIcon from '../../assets/Images/Feed/questions.svg';
import QuestionsWhite from '../../assets/Images/Feed/questions_white.svg';
import QuestionsDisabled from '../../assets/Images/Feed/questions_disabled.svg';

const SectionsBar = ({ user, myself, selected, setSelected, status }) => {
    const privateUser = user[USER_CONSTANTS.PRIVACY_PREFERENCE] === 'private' && !myself && (!status || status?.pending);
    const adminSections = [
        {
            key: DATABASE_CONSTANTS.TIPS,
            title: 'our tips',
            icon: <Pencil style={{ color: selected === DATABASE_CONSTANTS.TIPS ? colors.WHITE : colors.PRIMARY_COLOR }} />,
            onPress: () => setSelected(DATABASE_CONSTANTS.TIPS),
        },
    ];
    const userSections = [
        {
            key: DATABASE_CONSTANTS.ITEMS,
            title: 'items',
            icon: (
                <ShoppingBag
                    style={{
                        color: privateUser
                            ? colors.DARKER_GREY
                            : selected === DATABASE_CONSTANTS.ITEMS
                            ? colors.WHITE
                            : colors.PRIMARY_COLOR,
                    }}
                />
            ),
            onPress: () => setSelected(DATABASE_CONSTANTS.ITEMS),
        },
        {
            key: DATABASE_CONSTANTS.TIPS,
            title: 'tips',
            icon: (
                <Pencil
                    style={{
                        color: privateUser
                            ? colors.DARKER_GREY
                            : selected === DATABASE_CONSTANTS.TIPS
                            ? colors.WHITE
                            : colors.PRIMARY_COLOR,
                    }}
                />
            ),
            onPress: () => setSelected(DATABASE_CONSTANTS.TIPS),
        },
        {
            key: DATABASE_CONSTANTS.REVIEWS,
            title: 'reviews',
            icon: (
                <Star
                    style={{
                        color: privateUser
                            ? colors.DARKER_GREY
                            : selected === DATABASE_CONSTANTS.REVIEWS
                            ? colors.WHITE
                            : colors.PRIMARY_COLOR,
                    }}
                />
            ),
            onPress: () => setSelected(DATABASE_CONSTANTS.REVIEWS),
        },
        {
            key: DATABASE_CONSTANTS.QUESTIONS,
            title: 'q&a',
            icon: privateUser ? (
                <QuestionsDisabled style={styles.buttonIcon} />
            ) : selected === DATABASE_CONSTANTS.QUESTIONS ? (
                <QuestionsWhite style={styles.buttonIcon} />
            ) : (
                <QuestionsIcon style={styles.buttonIcon} />
            ),
            onPress: () => setSelected(DATABASE_CONSTANTS.QUESTIONS),
        },
    ];
    const sections = user?.role === 'admin' ? adminSections : userSections;

    return (
        <View style={styles.sectionContainer}>
            {sections.map((item) => {
                if (selected === item.key) {
                    return (
                        <TouchableOpacity key={item.key} style={styles.section} disabled={privateUser} onPress={item.onPress}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: privateUser ? colors.GREY : colors.PRIMARY_COLOR },
                                ]}>
                                {item.icon}
                            </View>
                            <Text style={[styles.title, { color: privateUser ? colors.DARKER_GREY : colors.PRIMARY_COLOR }]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    );
                } else {
                    return (
                        <TouchableOpacity key={item.key} style={styles.section} disabled={privateUser} onPress={item.onPress}>
                            <View style={styles.iconContainer}>{item.icon}</View>
                            <Text style={[styles.title, { color: privateUser ? colors.DARKER_GREY : colors.BLACK }]}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    );
                }
            })}
        </View>
    );
};

SectionsBar.defaultProps = {
    myself: false,
};

SectionsBar.propTypes = {
    user: PropTypes.shape({
        uid: PropTypes.string,
        role: PropTypes.string,
    }).isRequired,
    myself: PropTypes.bool.isRequired,
    selected: PropTypes.string.isRequired,
    setSelected: PropTypes.func.isRequired,
};

export default SectionsBar;

const styles = StyleSheet.create({
    sectionContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginVertical: 30,
    },
    section: {
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        backgroundColor: colors.GREY,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        fontSize: 20,
        color: colors.PRIMARY_COLOR,
        textAlign: 'center',
    },
    title: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 13,
        color: colors.BLACK,
    },
});
