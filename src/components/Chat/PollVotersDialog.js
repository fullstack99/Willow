import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import FirebaseUser from '../../service/firebase_requests/User';

import { fonts, colors } from '../../constants';
const { height } = Dimensions.get('screen');

const PollVotersDialog = ({ forwardRef, votersID, title }) => {
    const [voters, setVoters] = useState([]);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        Array.isArray(votersID) &&
            Promise.all(votersID.map((voterID) => FirebaseUser.getUserById(voterID)))
                .then(setVoters)
                .catch(console.log);
    }, [votersID]);

    const _renderRow = ({ item }) => {
        return (
            <View style={styles.renderItem}>
                <View style={styles.userInfo}>
                    <FastImage style={styles.avatar} source={{ uri: item.avatar_url }} />
                    <View>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                            {item.name}
                        </Text>
                        <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                            {item.username}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <RBSheet
            ref={forwardRef}
            animationType={'slide'}
            dragFromTopOnly
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: {
                    ...styles.dialogContainer,
                    maxHeight: height * 0.5,
                    height: votersID.length * 50 + 170,
                    paddingBottom: insets.bottom,
                },
            }}>
            <FlatList
                data={voters}
                renderItem={_renderRow}
                keyExtractor={(item) => item.uid}
                showsVerticalScrollIndicator={false}
                style={styles.flatList}
                ListHeaderComponent={<Text style={styles.title}>{title}</Text>}
            />
        </RBSheet>
    );
};

PollVotersDialog.propTypes = {
    forwardRef: PropTypes.object.isRequired,
    votersID: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
};

export default PollVotersDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 300,
        paddingHorizontal: 20,
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
    username: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: 'normal',
        fontSize: 13,
        color: colors.GREY_2,
        marginTop: 3,
    },
    renderItem: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 20,
    },
    flatList: {
        flex: 1,
        width: '100%',
        marginTop: 10,
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        textAlign: 'center',
    },
});
