import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, View, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { fonts, colors, emoji } from '../../../constants';
import Button from '../../../components/Button';
import Toast from '../../../components/Toast';
import FirebaseError from '../../../service/firebase_errors';
import User from '../../../service/firebase_requests/User';
import * as USER_CONSTANTS from '../../../constants/User';
import GlobalStyles from '../../../constants/globalStyles';
import { discardAlert } from '../../../utility';
import { BUN_OVEN, ABOUT_CHILDREN } from '../../../navigator/constants';
import SelectedBackground from '../../../assets/Images/full.png';
import UnselectedBackground from '../../../assets/Images/empty.png';
const { height } = Dimensions.get('window');

const statusList = [
    { key: 'planning', title: 'planning', emoji: emoji.redHeart },
    { key: 'expecting', title: 'expecting', emoji: emoji.egg },
    { key: 'parent', title: 'parent', emoji: emoji.duck },
];

const Status = ({ navigation, user }) => {
    const [selected, setSelected] = useState(user[USER_CONSTANTS.STATUS] || []);
    const [unsaved, setUnsaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const firstUpdate = useRef(true);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        setUnsaved(true);
    }, [selected]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!unsaved) return;

            e.preventDefault();
            discardAlert(() => navigation.dispatch(e.data.action));
        });

        return () => unsubscribe && unsubscribe();
    }, [navigation, unsaved, loading]);

    const selectStatus = (status) => {
        if (selected.indexOf(status) === -1) {
            setSelected([...selected, status]);
        } else {
            setSelected(selected.filter((s) => s !== status));
        }
    };

    const onConfirm = async () => {
        setLoading(true);
        setUnsaved(false);
        User.updateUser({
            [USER_CONSTANTS.STATUS]: selected,
        })
            .then(() => {
                setLoading(false);
                if (selected.length === 0 || (selected.length === 1 && selected.indexOf('planning') !== -1)) {
                    return navigation.goBack();
                } else if (
                    (selected.length === 1 && selected.indexOf('parent') !== -1) ||
                    (selected.length === 2 && selected.indexOf('planning') !== -1 && selected.indexOf('parent') !== -1)
                ) {
                    return navigation.navigate(ABOUT_CHILDREN);
                } else {
                    return navigation.navigate(BUN_OVEN, { selected });
                }
            })
            .catch((error) => {
                setLoading(false);
                setUnsaved(true);
                return FirebaseError.setError(error, setError);
            });
    };

    return (
        <SafeAreaView style={GlobalStyles.alignCenterContainer}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <Text style={styles.title}>tell us about your parenting status</Text>
            <View style={styles.selectionContainer}>
                {statusList.map((s) => (
                    <TouchableOpacity key={s.key} style={styles.selection} onPress={() => selectStatus(s.key)}>
                        <ImageBackground
                            source={selected.indexOf(s.key) === -1 ? UnselectedBackground : SelectedBackground}
                            resizeMode={'stretch'}
                            style={styles.selectionBackground}>
                            <View style={styles.content}>
                                <Text style={styles.emoji}>{s.emoji}</Text>
                                <Text style={styles.selectionTitle}>{s.title}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                ))}
            </View>
            <Button onPress={onConfirm} disabled={loading}>
                confirm
            </Button>
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Status);

const styles = StyleSheet.create({
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 22,
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 50,
    },
    selectionContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-around',
    },
    selection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: height > 800 ? 30 : 15,
        borderRadius: 25,
    },
    selectionBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        color: colors.PRIMARY_COLOR,
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 25,
    },
    selectionTitle: {
        color: colors.BLACK,
        fontFamily: fonts.NEWYORKMEDIUM_SEMIBOLD,
        fontSize: 15,
    },
});
