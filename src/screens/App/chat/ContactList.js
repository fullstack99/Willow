import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import AlphabetList from 'react-native-flatlist-alphabet';
import SendSMS from 'react-native-sms';
import Share from 'react-native-share';

import { colors, fonts } from '../../../constants';
import AddUser from '../../../assets/Images/add_user.svg';
import Header from '../../../components/Chat/Header';
import ListItem from '../../../components/Chat/ListItem';
import User from '../../../components/Chat/User';
import SearchInput from '../../../components/Chat/SearchInput';
import Button from '../../../components/Button';
import PhoneDialog from '../../../components/Chat/PhoneDialog';

const { width, height } = Dimensions.get('screen');

const ContactList = ({ navigation, route }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [phones, setPhones] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const filterRef = useRef(null);
    const { title, from } = route.params;
    const data = [
        {
            uid: '1e0XcwaalFepwaH7aUNsBicMv2k1',
            value: 'Aill Moriss1',
            name: 'Aill Moriss1',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            uid: '7Z3pXGJEBnWIjha5nBklaQeE3NU2',
            value: 'Aill Moriss1',
            name: 'Aill Moriss1',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            uid: 'fgBf3tcMRJWhCaEFfi2GsmGKti72',
            value: 'Aill Moriss1',
            name: 'Aill Moriss1',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
    ];

    const _renderItem = (item) => (
        <View style={styles.renderItem}>
            <ListItem item={item} selectedUsers={selectedUsers} onPress={toggleUser} from="contacts" />
        </View>
    );

    const _renderSectionHeader = (section) => {
        return (
            <View style={styles.sectionHeaderView}>
                <Text style={styles.sectionHeader}>{section.title}</Text>
            </View>
        );
    };

    const goBack = () => navigation.goBack();

    const onSearchSubmit = () => {
        console.log(search);
        // TODO API call
    };

    const onSelectPhone = (phone) => {
        filterRef.current.close();
        const temp = [...phones, ...phone.filter((v) => !phones.includes(v))];
        setPhones(temp);
    };

    const toggleUser = (user) => {
        if (user && user.telephone && user.home) {
            setSelectedUser(user);
            filterRef.current.open && filterRef.current.open();
            return;
        }
        const index = selectedUsers.findIndex((v) => v.uid === user.uid);
        if (index > -1) {
            selectedUsers.splice(index, 1);
        } else {
            selectedUsers.push(user);
        }
        setSelectedUsers(selectedUsers);
        setRefresh(!refresh);
        const phoneIndex = phones.findIndex((v) => v === user.home);
        if (phoneIndex > -1) {
            phones.splice(phoneIndex, 1);
        } else {
            phones.push(user.home);
        }
        setPhones(phones);
    };

    const handleSendMessage = () => {
        SendSMS.send(
            {
                body: 'Add me on Willow! Username: katiekatie https://www.willlow/com/add/katiekatie/Ne9zJ',
                recipients: ['18064968476', '18727010610'],
                successTypes: ['sent', 'queued'],
                allowAndroidSendWithoutReadPermission: true,
            },
            (completed, cancelled, error) => {
                if (completed) {
                    console.log('SMS Sent Completed');
                } else if (cancelled) {
                    console.log('SMS Sent Cancelled');
                } else if (error) {
                    console.log('Some error occured', error);
                }
            },
        );
    };

    const handleShareLink = () => {
        const options = {
            title: 'Please share Willow',
            message: `Hey, would you like to try out our new app? It's Willow time! 😊`,
            url: 'https://willow.app',
        };
        try {
            Share.open(options)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    err && console.log(err);
                });
        } catch (err) {
            console.log(err);
        }
    };

    const renderPhoneDialogSheet = () => {
        return (
            <PhoneDialog
                filterRef={filterRef}
                onClose={() => filterRef.current.close()}
                onDone={(phone) => {
                    filterRef.current.close();
                }}
                onSelectPhone={onSelectPhone}
                user={selectedUser}
            />
        );
    };

    return (
        <React.Fragment>
            <SafeAreaView style={styles.container}>
                <Header enabledBack={true} title={title} goBack={goBack} />
                <View style={styles.top}>
                    <SearchInput onSearchSubmit={onSearchSubmit} search={search} setSearch={setSearch} />
                </View>
                <View style={styles.alpaList}>
                    <AlphabetList
                        data={data}
                        renderItem={_renderItem}
                        renderSectionHeader={_renderSectionHeader}
                        indexLetterSize={16}
                        letterItemStyle={styles.letter}
                        indexLetterColor={colors.BLACK_3}
                    />
                </View>
                {selectedUsers.length > 0 && (
                    <Button onPress={from === 'chat-setting' ? handleShareLink : handleSendMessage} height={60}>
                        <Text style={styles.buttonText}>
                            {from === 'chat-setting' ? 'Send link' : 'Send Invite'}(<Text>{selectedUsers.length}</Text>)
                        </Text>
                    </Button>
                )}
            </SafeAreaView>
            {renderPhoneDialogSheet()}
        </React.Fragment>
    );
};

export default ContactList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        width: '100%',
    },
    top: {
        backgroundColor: colors.WHITE,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    sectionHeaderView: {
        height: 50,
        zIndex: 99,
        paddingHorizontal: 20,
        justifyContent: 'center',
        backgroundColor: colors.WHITE,
    },
    sectionHeader: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.BLACK,
    },
    buttonText: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 16,
        color: colors.WHITE,
    },
    letter: { height: 20 },
    alpaList: {
        marginTop: 20,
        height: height - 300,
    },
    renderItem: {
        width: width - 20,
    },
});
