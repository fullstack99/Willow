import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import User from '../../service/firebase_requests/User';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import { childrenListSort } from '../../utility';
const { width } = Dimensions.get('window');

const ChildrenDialog = ({ forwardRef, user }) => {
    const [children, setChildren] = useState([]);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const handleChildrenChanges = (querySnapshot) => {
            let currentChildren = querySnapshot.docs.map((docSnapshot) => ({ uid: docSnapshot.id, ...docSnapshot.data() })) || [];
            currentChildren = currentChildren.filter((kid) => kid.birthday !== null && kid.gender !== null);
            currentChildren.sort(childrenListSort);
            setChildren(currentChildren);
        };

        const unsubscribe = User.retrieveListOfChildren(
            {
                next: handleChildrenChanges,
                error: (error) => console.log(error),
            },
            user.uid,
        );

        return unsubscribe;
    }, [setChildren]);

    const parseBirthdayToAge = (birthday) => {
        if (!moment(birthday, 'MM/DD/YYYY').isValid()) return '';
        const years = moment.duration(moment().diff(moment(birthday, 'MM/DD/YYYY'))).years();
        const months = moment.duration(moment().diff(moment(birthday, 'MM/DD/YYYY'))).months();
        const days = moment.duration(moment().diff(moment(birthday, 'MM/DD/YYYY'))).days();
        switch (typeof years === 'number') {
            case years > 0:
                return `${years} ${years === 1 ? 'year' : 'years'} old`;
            default:
                switch (typeof months === 'number') {
                    case months > 0:
                        return `${months} ${months === 1 ? 'month' : 'months'} old`;
                    default:
                        return `${days} ${days === 1 ? 'day' : 'days'} old`;
                }
        }
    };

    const _renderKidIcon = (birthday, gender) => {
        if (!moment(birthday, 'MM/DD/YYYY').isValid()) return null;
        const years = moment.duration(moment().diff(moment(birthday, 'MM/DD/YYYY'))).years();
        switch (typeof years === 'number') {
            case years < 4:
                return <Text style={styles.kidIcon}>👶</Text>;
            case years >= 4 && years < 13:
                return <Text style={styles.kidIcon}>{gender === 'male' ? '👦' : gender === 'female' ? '👧' : '😊'}</Text>;
            default:
                return <Text style={styles.kidIcon}>{gender === 'male' ? '👨' : gender === 'female' ? '👧' : '😊'}</Text>;
        }
    };

    const _renderKidStatus = (birthday) => {
        if (!moment(birthday, 'MM/DD/YYYY').isValid()) return null;
        const years = moment.duration(moment().diff(moment(birthday, 'MM/DD/YYYY'))).years();
        const months = moment.duration(moment().diff(moment(birthday, 'MM/DD/YYYY'))).months();
        switch (typeof years === 'number') {
            case years < 1:
                switch (typeof months === 'number') {
                    case months < 3:
                        return <Text style={styles.kidStatus}>newborn</Text>;
                    default:
                        return <Text style={styles.kidStatus}>infant</Text>;
                }
            case years >= 1 && years < 4:
                return <Text style={styles.kidStatus}>toddler</Text>;
            case years >= 4 && years < 9:
                return <Text style={styles.kidStatus}>child</Text>;
            case years >= 9 && years < 13:
                return <Text style={styles.kidStatus}>tween</Text>;
            case years >= 13 && years < 18:
                return <Text style={styles.kidStatus}>teen</Text>;
            default:
                return <Text style={styles.kidStatus}>adult</Text>;
        }
    };

    return (
        <RBSheet
            ref={forwardRef}
            height={Dimensions.get('window').height * 0.4}
            animationType={'slide'}
            closeOnPressMask
            openDuration={250}
            customStyles={{
                container: GlobalStyles.dialogContainer,
            }}>
            <FlatList
                numColumns={2}
                ListHeaderComponent={() => <Text style={styles.title}>children</Text>}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.uid}
                data={children}
                bounces={false}
                style={{ width }}
                contentContainerStyle={{ marginHorizontal: 20, paddingBottom: insets.bottom }}
                renderItem={({ item }) => (
                    <View style={styles.children}>
                        <View style={styles.kidIconContainer}>{_renderKidIcon(item.birthday, item.gender)}</View>
                        <View style={styles.kidStatusContainer}>
                            {_renderKidStatus(item.birthday)}
                            <Text style={styles.kidAge}>{parseBirthdayToAge(item.birthday)}</Text>
                        </View>
                    </View>
                )}
            />
        </RBSheet>
    );
};

export default ChildrenDialog;

const styles = StyleSheet.create({
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20,
    },
    children: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    kidIconContainer: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        backgroundColor: colors.GREY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    kidIcon: {
        fontSize: 30,
    },
    kidStatusContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginLeft: 15,
    },
    kidStatus: {
        fontSize: 15,
        fontFamily: fonts.MULISH_REGULAR,
        paddingBottom: 5,
    },
    kidAge: {
        fontSize: 13,
        fontFamily: fonts.MULISH_REGULAR,
        color: '#2C2A4A',
    },
});
