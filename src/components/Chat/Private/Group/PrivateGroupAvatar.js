import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import { colors, fonts } from '../../../../constants';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import FirebaseUser from '../../../../service/firebase_requests/User';

const PrivateGroupAvatar = ({ room, members, memberIDs, width, style }) => {
    if (!Array.isArray(members) && !Array.isArray(memberIDs)) return null;
    const [groupMembers, setGroupMembers] = useState(members || null);

    useEffect(() => {
        if (Array.isArray(members)) {
            setGroupMembers(members);
        } else if (Array.isArray(memberIDs)) {
            Promise.all(memberIDs.map((id) => FirebaseUser.getUserById(id)))
                .then(setGroupMembers)
                .catch(console.log);
        } else {
            setGroupMembers(null);
        }
    }, [members, memberIDs]);

    if (!Array.isArray(groupMembers)) return null;
    else if (room?.avatar_url) {
        return (
            <View style={[styles.container, style]}>
                <FastImage
                    source={{ uri: room.avatar_url }}
                    style={[styles.avatar, { width, height: width, borderRadius: width / 2 }]}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        );
    } else {
        switch (true) {
            case groupMembers.length === 1:
                return (
                    <View style={[styles.container, style]}>
                        <FastImage
                            source={{ uri: groupMembers[0]?.avatar_url }}
                            style={[styles.avatar, { width, height: width, borderRadius: width / 2 }]}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>
                );
            case groupMembers.length === 2:
                return (
                    <View style={[styles.container, style]}>
                        <View style={[styles.avatarContainer, { width, height: width }]}>
                            {groupMembers.map((member, index) => {
                                if (index === 0) {
                                    return (
                                        <View key={member.uid} style={styles.leftSemiAvatar}>
                                            <FastImage
                                                source={{ uri: member?.avatar_url }}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderTopLeftRadius: width / 2,
                                                    borderBottomLeftRadius: width / 2,
                                                }}
                                                resizeMode={FastImage.resizeMode.cover}
                                            />
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View key={member.uid} style={styles.rightSemiAvatar}>
                                            <FastImage
                                                source={{ uri: member?.avatar_url }}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderTopRightRadius: width / 2,
                                                    borderBottomRightRadius: width / 2,
                                                }}
                                                resizeMode={FastImage.resizeMode.cover}
                                            />
                                        </View>
                                    );
                                }
                            })}
                        </View>
                    </View>
                );
            case groupMembers.length === 3:
                return (
                    <View style={[styles.container, style]}>
                        <View style={[styles.avatarContainer, { width, height: width }]}>
                            <View style={styles.leftSemiAvatar}>
                                <FastImage
                                    source={{ uri: groupMembers[0]?.avatar_url }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderTopLeftRadius: width / 2,
                                        borderBottomLeftRadius: width / 2,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>
                            <View style={styles.rightSemiAvatar}>
                                <View style={{ width: '100%', height: '50%', paddingBottom: 1 }}>
                                    <FastImage
                                        source={{ uri: groupMembers[1]?.avatar_url }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderTopRightRadius: width / 2,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={{ width: '100%', height: '50%', paddingTop: 1 }}>
                                    <FastImage
                                        source={{ uri: groupMembers[2]?.avatar_url }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderBottomRightRadius: width / 2,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                );
            case groupMembers.length === 4:
                return (
                    <View style={[styles.container, style]}>
                        <View style={[styles.avatarContainer, { width, height: width }]}>
                            <View style={styles.leftSemiAvatar}>
                                <View style={{ width: '100%', height: '50%', paddingBottom: 1 }}>
                                    <FastImage
                                        source={{ uri: groupMembers[0]?.avatar_url }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: width / 2,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={{ width: '100%', height: '50%', paddingTop: 1 }}>
                                    <FastImage
                                        source={{ uri: groupMembers[1]?.avatar_url }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: width / 2,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                            </View>
                            <View style={styles.rightSemiAvatar}>
                                <View style={{ width: '100%', height: '50%', paddingBottom: 1 }}>
                                    <FastImage
                                        source={{ uri: groupMembers[2]?.avatar_url }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: width / 2,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={{ width: '100%', height: '50%', paddingTop: 1 }}>
                                    <FastImage
                                        source={{ uri: groupMembers[3]?.avatar_url }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: width / 2,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                );
            case groupMembers.length > 4:
                return (
                    <View style={[styles.container, style]}>
                        <View style={[styles.avatarContainer, { width, height: width }]}>
                            <View style={styles.leftSemiAvatar}>
                                <View style={{ width: '100%', height: '50%', paddingBottom: 1 }}>
                                    <FastImage
                                        source={{ uri: groupMembers[0]?.avatar_url }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: width / 2,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={{ width: '100%', height: '50%', paddingTop: 1 }}>
                                    <FastImage
                                        source={{ uri: groupMembers[1]?.avatar_url }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: width / 2,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                            </View>
                            <View style={styles.rightSemiAvatar}>
                                <View style={{ width: '100%', height: '50%', paddingBottom: 1 }}>
                                    <FastImage
                                        source={{ uri: groupMembers[2]?.avatar_url }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: width / 2,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={{ width: '100%', height: '50%', paddingTop: 1 }}>
                                    <View style={[styles.numberCircle, { borderRadius: width / 2 }]}>
                                        <Text style={styles.number}>{`+${groupMembers.length - 3}`}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    }
};

PrivateGroupAvatar.defaultProps = {
    width: 50,
};

PrivateGroupAvatar.propTypes = {
    room: PropTypes.shape({ id: PropTypes.string.isRequired, avatar_url: PropTypes.string }),
    members: PropTypes.arrayOf(PropTypes.shape({ uid: PropTypes.string.isRequired, avatar_url: PropTypes.string.isRequired })),
    memberIDs: PropTypes.arrayOf(PropTypes.string.isRequired),
    width: PropTypes.number.isRequired,
    style: ViewPropTypes.style,
};

export default PrivateGroupAvatar;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
    },
    avatarContainer: {
        height: 50,
        width: 50,
        flexDirection: 'row',
    },
    leftSemiAvatar: {
        flex: 1,
        paddingRight: 1,
    },
    rightSemiAvatar: {
        flex: 1,
        paddingLeft: 1,
    },
    numberCircle: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.GREY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    number: {
        fontFamily: fonts.MULISH_SEMIBOLD,
        fontSize: 10,
        color: colors.PRIMARY_COLOR,
    },
});
