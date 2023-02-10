import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import moment from 'moment';
import Button from '../../../components/Button';
import Toast from '../../../components/Toast';
import User from '../../../service/firebase_requests/User';
import FirebaseError from '../../../service/firebase_errors';
import { SETTINGS } from '../../../navigator/constants';
import GlobalStyles from '../../../constants/globalStyles';
import { emoji, fonts, colors } from '../../../constants';
import AddKidsButton from '../../../assets/Images/Profile/add_kids_button.svg';
import SelectGenderDialog from '../../../components/Dialogs/SelectGenderDialog';
import DatePickerDialog from '../../../components/Dialogs/DatePickerDialog';
import FadeAnimationText from '../../../components/FadeAnimationText';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import { childrenListSort } from '../../../utility';

const AboutChildren = ({ navigation }) => {
    const [children, setChildren] = useState([]);
    const [selectedKid, setSelectedKid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const selectBirthdayDialogRef = useRef();
    const selectGenderDialogRef = useRef();

    useEffect(() => {
        const handleChildrenChanges = (querySnapshot) => {
            let currentChildren = querySnapshot.docs.map((docSnapshot) => ({ uid: docSnapshot.id, ...docSnapshot.data() })) || [];
            currentChildren.sort(childrenListSort);
            setChildren(currentChildren);
        };

        const unsubscribe = User.retrieveListOfChildren({
            next: handleChildrenChanges,
            error: (error) => FirebaseError.setError(error, setError),
        });

        return unsubscribe;
    }, [setChildren]);

    useEffect(() => {
        // default to first newborn after user has created a child
        if (
            Array.isArray(children) &&
            children.length > 0 &&
            children.findIndex((k) => k.birthday === null && k.gender === null) !== -1
        ) {
            setSelectedKid(children[0]);
        }
    }, [children]);

    useEffect(() => {
        // default to first kid if children list is not empty and selectedKid is null
        if (selectedKid === null && Array.isArray(children) && children.length > 0) {
            setSelectedKid(children[0]);
        }
    }, [children, selectedKid]);

    const onDone = () => {
        navigation.navigate(SETTINGS);
    };

    const focusKid = (kid) => {
        kid.uid !== selectedKid.uid && setSelectedKid(kid);
    };

    const onKidLongPress = (kid) => {
        Alert.alert('Delete Child', 'Are you sure you want to remove this child?', [
            {
                text: 'Remove',
                style: 'destructive',
                onPress: () => {
                    User.deleteChildById(kid.uid)
                        .then(() => kid.uid === selectedKid.uid && setSelectedKid(null))
                        .catch((err) => FirebaseError.setError(err, setError))
                        .finally(() => setLoading(false));
                },
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const onAddKidPress = () => {
        setLoading(true);
        User.createChild()
            .catch((err) => FirebaseError.setError(err, setError))
            .finally(() => {
                setLoading(false);
            });
    };

    const toggleSelectBirthdayDialog = () => {
        if (!selectBirthdayDialogRef) return;
        else if (selectBirthdayDialogRef.current.state.modalVisible) selectBirthdayDialogRef.current.close();
        else selectBirthdayDialogRef.current.open();
    };

    const toggleSelectGenderDialog = () => {
        if (!selectGenderDialogRef) return;
        else if (selectGenderDialogRef.current.state.modalVisible) selectGenderDialogRef.current.close();
        else selectGenderDialogRef.current.open();
    };

    const updateBirthdayOnSelectedKid = (birthday) => {
        if (!birthday) toggleSelectBirthdayDialog();
        const kid_birthday = birthday ? moment(birthday, 'YYYY/MM/DD').format('MM/DD/YYYY') : null;
        const newSelectedKid = {
            ...selectedKid,
            birthday: kid_birthday,
        };
        setSelectedKid(newSelectedKid);
        User.updateChildById(selectedKid.uid, {
            gender: selectedKid.gender,
            birthday: kid_birthday,
        });
    };

    const updateGenderOnSelectedKid = (gender) => {
        const newSelectedKid = {
            ...selectedKid,
            gender,
        };
        setSelectedKid(newSelectedKid);
        User.updateChildById(selectedKid.uid, {
            birthday: selectedKid.birthday,
            gender,
        });
    };

    const _renderAge = () => {
        if (!moment(selectedKid?.birthday, 'MM/DD/YYYY').isValid()) return 'choose birthday';
        else {
            const duration = moment.duration(moment().diff(moment(selectedKid?.birthday, 'MM/DD/YYYY')));
            switch (Boolean(duration)) {
                case duration.years() >= 2:
                    return `${duration.years()} y.o.`;
                case duration.years() >= 1 && duration.years() < 2:
                    return `${duration.years() * 12 + duration.months()} m.o.`;
                case duration.months() >= 1:
                    return `${duration.months()} m.o.`;
                case duration.days() > 0:
                    return `${duration.days()} d.o.`;
            }
        }
    };

    const _renderKidEmoji = (gender) => {
        switch (gender) {
            case 'male':
                return emoji.lion;
            case 'female':
                return emoji.cat;
            case 'prefer not to say':
                return emoji.wink;
            default:
                return emoji.duck;
        }
    };

    const disabled = (Array.isArray(children) && children.filter((k) => !k.birthday || !k.gender).length > 0) || false;
    const genderStyle = {
        backgroundColor:
            selectedKid?.gender === 'male'
                ? colors.GENDER.MALE
                : selectedKid?.gender === 'female'
                ? colors.GENDER.FEMALE
                : colors.GENDER.NEUTRAL,
    };

    if (!children) return null;

    return (
        <React.Fragment>
            <SafeAreaView style={GlobalStyles.alignCenterContainer}>
                <LoadingDotsOverlay animation={loading} />
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <Text style={styles.title}>tell us about your child(ren)</Text>
                <Text style={styles.subtitle}>this will help you and other members of the Willow community connect</Text>
                <FadeAnimationText showText={children.length === 0} style={[styles.subtitle, { fontFamily: fonts.MULISH_BOLD }]}>
                    {`\nplease click the + icon to start`}
                </FadeAnimationText>
                <View style={styles.kidsSection}>
                    <View style={styles.optionsBoxContainer}>
                        <TouchableOpacity
                            style={[styles.option, genderStyle]}
                            disabled={selectedKid === null}
                            onPress={toggleSelectBirthdayDialog}>
                            <View>
                                <Text style={styles.emoji}>🥳</Text>
                                <Text style={styles.optionTitle}>how old?</Text>
                                <FadeAnimationText showText={Boolean(selectedKid)} style={styles.choose}>
                                    {_renderAge()}
                                </FadeAnimationText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.option, genderStyle]}
                            disabled={selectedKid === null}
                            onPress={toggleSelectGenderDialog}>
                            <View>
                                <Text style={styles.emoji}>😌</Text>
                                <Text style={styles.optionTitle}>what gender?</Text>
                                <FadeAnimationText showText={Boolean(selectedKid)} style={styles.choose}>
                                    {selectedKid?.gender ? selectedKid.gender : 'choose gender'}
                                </FadeAnimationText>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.userActionsContainer}
                        contentContainerStyle={styles.userActionsContentContainer}
                        keyExtractor={(kid, index) => kid?.uid || index.toString()}
                        data={children}
                        renderItem={({ item }) => (
                            <View
                                style={selectedKid?.uid === item.uid ? [styles.kidRing, styles.focusedKidRing] : styles.kidRing}>
                                <TouchableOpacity
                                    style={
                                        selectedKid?.uid === item.uid
                                            ? [styles.kidIconContainer, genderStyle]
                                            : styles.kidIconContainer
                                    }
                                    onPress={() => focusKid(item)}
                                    onLongPress={() => onKidLongPress(item)}>
                                    <Text style={styles.emojiKid}>{_renderKidEmoji(item.gender)}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        ListFooterComponent={
                            <TouchableOpacity onPress={onAddKidPress}>
                                <AddKidsButton width={50} height={50} style={{ marginHorizontal: 10 }} />
                            </TouchableOpacity>
                        }
                    />
                </View>
                <Button onPress={onDone} disabled={disabled}>
                    done
                </Button>
            </SafeAreaView>
            <DatePickerDialog
                forwardRef={selectBirthdayDialogRef}
                date={selectedKid ? selectedKid.birthday : null}
                onDateChange={updateBirthdayOnSelectedKid}
                clearDate={() => updateBirthdayOnSelectedKid(null)}
                title={`don't worry, we don't show your child's actual birthday, but we do show their age`}
                current={moment(moment().subtract(2, 'years')).format('YYYY-MM-DD')}
                maximumDate={moment().format('YYYY-MM-DD')}
                minimumDate={moment(moment().subtract(50, 'years')).format('YYYY-MM-DD')}
            />
            <SelectGenderDialog forwardRef={selectGenderDialogRef} kid={selectedKid} onGenderChoose={updateGenderOnSelectedKid} />
        </React.Fragment>
    );
};

export default AboutChildren;

const styles = StyleSheet.create({
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
        marginVertical: 30,
    },
    subtitle: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        paddingHorizontal: 40,
        textAlign: 'center',
    },
    kidsSection: {
        flex: 1,
        marginVertical: 40,
        alignItems: 'center',
    },
    optionsBoxContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREY,
        marginHorizontal: 20,
        borderRadius: 20,
        minHeight: 210,
    },
    optionTitle: {
        fontFamily: fonts.NEWYORKMEDIUM_SEMIBOLD,
        fontSize: 15,
        paddingHorizontal: 20,
    },
    choose: {
        paddingVertical: 20,
        color: colors.PRIMARY_COLOR,
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 13,
        textAlign: 'center',
    },
    emoji: {
        fontSize: 40,
        textAlign: 'center',
        paddingVertical: 30,
    },
    userActionsContainer: {
        marginVertical: 10,
        marginHorizontal: 20,
        maxHeight: 80,
    },
    userActionsContentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    kidIconContainer: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        backgroundColor: colors.GREY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    kidRing: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    focusedKidRing: {
        borderRadius: 60 / 2,
        borderWidth: 2,
        borderColor: colors.PRIMARY_COLOR,
    },
    emojiKid: {
        fontSize: 20,
    },
});
