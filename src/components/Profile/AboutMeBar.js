import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { CommonActions } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import moment from 'moment';
import Shimmer from 'react-native-shimmer';
import { fonts, colors } from '../../constants';
import * as USER_CONSTANTS from '../../constants/User';
import { MY_PROFILE, SETTINGS, STATUS, ACCOUNT } from '../../navigator/constants';
import ChildrenDialog from '../Dialogs/ChildrenDialog';
const { width } = Dimensions.get('window');

const AboutMeBar = ({ user, navigation, myself }) => {
    if (!user) return null;
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef();
    const childrenDialogRef = useRef();

    const _renderAboutMe = () => {
        if (myself && !user[USER_CONSTANTS.ABOUT_ME]) {
            return (
                <TouchableOpacity style={styles.addStatusButton} onPress={() => navigation.navigate(ACCOUNT)}>
                    <Shimmer pauseDuration={2000}>
                        <Text style={styles.aboutme}>add info</Text>
                    </Shimmer>
                </TouchableOpacity>
            );
        } else {
            return <Text style={styles.aboutme}>{user[USER_CONSTANTS.ABOUT_ME] || `no bio for this user 😔`}</Text>;
        }
    };

    const _renderChildrenStatus = () => {
        switch (typeof user[USER_CONSTANTS.NUMBER_OF_CHILDREN] === 'number') {
            case user[USER_CONSTANTS.NUMBER_OF_CHILDREN] === 0:
                switch (typeof user[USER_CONSTANTS.STATUS]?.length === 'number') {
                    case user[USER_CONSTANTS.STATUS]?.length === 0:
                        if (myself) {
                            return (
                                <TouchableOpacity
                                    style={styles.addStatusButton}
                                    onPress={() => {
                                        navigation.dispatch(
                                            CommonActions.reset({
                                                index: 2,
                                                routes: [{ name: MY_PROFILE }, { name: SETTINGS }, { name: STATUS }],
                                            }),
                                        );
                                    }}>
                                    <Shimmer pauseDuration={2000}>
                                        <Text style={styles.aboutme}>add parental status</Text>
                                    </Shimmer>
                                </TouchableOpacity>
                            );
                        } else {
                            return <Text style={styles.aboutme}>{`parental status unknown 😔`}</Text>;
                        }
                    default:
                        return (
                            <Text style={styles.childrenText}>{`🎉 ${user[USER_CONSTANTS.STATUS]?.map((s, index) => {
                                if (index === user[USER_CONSTANTS.STATUS]?.length - 1) return ` ${s}`;
                                else return ` ${s}`;
                            })}`}</Text>
                        );
                }
            case user[USER_CONSTANTS.NUMBER_OF_CHILDREN] === 1:
                return (
                    <TouchableOpacity style={styles.childrenButton} onPress={toggleChildrenDialog}>
                        <Text style={styles.childrenText}>{`🎉 ${user[USER_CONSTANTS.NUMBER_OF_CHILDREN]} child`}</Text>
                    </TouchableOpacity>
                );
            case user[USER_CONSTANTS.NUMBER_OF_CHILDREN] === 2:
                return (
                    <TouchableOpacity style={styles.childrenButton} onPress={toggleChildrenDialog}>
                        <Text style={styles.childrenText}>{`🎉 ${user[USER_CONSTANTS.NUMBER_OF_CHILDREN]} children`}</Text>
                    </TouchableOpacity>
                );
            default:
                return (
                    <TouchableOpacity style={styles.childrenButton} onPress={toggleChildrenDialog}>
                        <Text style={styles.childrenText}>{`🎉 more than 2 children`}</Text>
                    </TouchableOpacity>
                );
        }
    };

    const _renderInfo = () => {
        if (myself && !user[USER_CONSTANTS.BIRTHDAY] && !user[USER_CONSTANTS.BIRTHDAY]) {
            return (
                <TouchableOpacity style={styles.addStatusButton} onPress={() => navigation.navigate(ACCOUNT)}>
                    <Shimmer pauseDuration={2000}>
                        <Text style={styles.aboutme}>add info</Text>
                    </Shimmer>
                </TouchableOpacity>
            );
        } else if (!myself && !user[USER_CONSTANTS.BIRTHDAY] && !user[USER_CONSTANTS.BIRTHDAY]) {
            return <Text style={styles.aboutme}>{`no age/location for this user 😔`}</Text>;
        } else {
            return (
                <View style={{ alignItems: 'center' }}>
                    {user[USER_CONSTANTS.BIRTHDAY] && moment(user[USER_CONSTANTS.BIRTHDAY], 'MM-DD-YYYY').isValid() ? (
                        <Text style={styles.aboutme}>{`${moment().diff(
                            moment(user[USER_CONSTANTS.BIRTHDAY], 'MM-DD-YYYY'),
                            'years',
                        )} years old`}</Text>
                    ) : null}
                    {user[USER_CONSTANTS.LOCATION]?.length > 0 ? (
                        <Text style={styles.aboutme}>{`${user[USER_CONSTANTS.LOCATION]}`}</Text>
                    ) : null}
                </View>
            );
        }
    };

    const toggleChildrenDialog = () => {
        if (!childrenDialogRef) return;

        if (childrenDialogRef.current.state.modalVisible) childrenDialogRef.current.close();
        else childrenDialogRef.current.open();
    };

    const data = [
        <React.Fragment>{_renderAboutMe()}</React.Fragment>,
        <React.Fragment>{_renderChildrenStatus()}</React.Fragment>,
        <React.Fragment>{_renderInfo()}</React.Fragment>,
    ];

    if (user?.role === 'admin') {
        return (
            <View style={styles.container}>
                <Shimmer pauseDuration={2000}>
                    <Text style={styles.aboutme}>{user[USER_CONSTANTS.ABOUT_ME] || ''}</Text>
                </Shimmer>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Carousel
                    ref={carouselRef}
                    data={data}
                    renderItem={({ item }) => item}
                    onSnapToItem={setActiveSlide}
                    itemWidth={width * 0.6}
                    sliderWidth={width * 0.6}
                    containerCustomStyle={{ flexGrow: 0 }}
                    slideStyle={styles.slideStyle}
                />
                <Pagination
                    carouselRef={carouselRef}
                    dotsLength={data.length}
                    activeDotIndex={activeSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={colors.PRIMARY_COLOR}
                    inactiveDotColor={colors.LIGHT_PRIMARY_COLOR}
                />
                <ChildrenDialog forwardRef={childrenDialogRef} user={user} />
            </View>
        );
    }
};

AboutMeBar.defaultProps = {
    myself: false,
};

AboutMeBar.propTypes = {
    user: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    myself: PropTypes.bool.isRequired,
};

export default AboutMeBar;

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    aboutme: {
        width: '100%',
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        textAlign: 'center',
        flexWrap: 'wrap',
        color: colors.PRIMARY_COLOR,
        fontWeight: '700',
    },
    slideStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationContainer: {
        paddingVertical: 15,
    },
    childrenButton: {
        width: '90%',
        paddingVertical: 15,
        borderRadius: 10,
        backgroundColor: colors.GREY,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    childrenText: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        textAlign: 'center',
    },
    addStatusButton: {
        backgroundColor: colors.GREY,
        paddingVertical: 15,
        width: '90%',
        borderRadius: 10,
    },
});
