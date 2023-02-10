import React, { Component } from 'react';
import {
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ActivityIndicator,
    Dimensions,
    FlatList,
    Linking,
    TouchableOpacity,
} from 'react-native';
import Contacts from 'react-native-contacts';
import { TabBar, TabView } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import ListItem from '../../components/SectionsList/ListItem';
import Avatar from '../../components/SectionsList/Avatar';
import SearchBar from '../../components/SectionsList/SearchBar';
import RBSheet from 'react-native-raw-bottom-sheet';
import { fonts, colors, emoji } from '../../constants';
import { AlphabetList } from 'willow-section-list';
// import Icon from "react-native-vector-icons/dist/AntDesign"
import Button from '../../components/Button';
const { height, width } = Dimensions.get('window');

export default class List extends Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);

        this.state = {
            contacts: [],
            checkedArr: [],
            contactsSearch: [],
            seletionContacts: [],
            searchPlaceholder: 'Search',
            typeText: null,
            loading: true,
            routes: [
                { key: 0, title: 'members' },
                { key: 1, title: 'contact list' },
            ],
            selectedContacts: {},
            index: 0,
            person: null,
        };

        // if you want to read/write the contact note field on iOS, this method has to be called
        // WARNING: by enabling notes on iOS, a valid entitlement file containing the note entitlement as well as a separate
        //          permission has to be granted in order to release your app to the AppStore. Please check the README.md
        //          for further information.
        Contacts.iosEnableNotesUsage(false);
    }
    _handleIndexChange = (index) => {
        this.setState({ index });
    };

    selectContacts = (id) => {
        console.log(id);
        let ids = this.state.checkedArr;
        if (!ids.includes(id)) {
            let addedVal = ids.concat(id);
            this.setState({ checkedArr: addedVal });
        } else {
            const index = ids.indexOf(id);
            if (index > -1) {
                ids.splice(index, 1);
                this.setState({
                    checkedArr: ids,
                });
            }
        }
        console.log(this.state.checkedArr, 'checked Arr');
    };
    _renderTabBar = (props) => (
        <TabBar
            style={{ backgroundColor: '#fff', paddingVertical: 5 }}
            {...props}
            activeColor={colors.PRIMARY_COLOR}
            inactiveColor="#111"
            labelStyle={{ fontSize: 16 }}
            scrollEnabled={false}
            indicatorStyle={{ color: colors.PRIMARY_COLOR, backgroundColor: colors.PRIMARY_COLOR }}
            // renderBadge={this.showBadge}
        />
    );

    selectContactsNew = (num, multiple) => {
        let temp = this.state.selectedContacts;
        console.log('mutl', multiple, num);
        if (!multiple) {
            if (temp[num]) {
                delete temp[num];
            } else {
                temp[num] = num;
            }
            this.setState({
                selectContacts: temp,
            });
        } else {
            this.setState({
                person: num,
                seletionContacts: num.phoneNumbers,
            });
            this.RBSheet2.open();
        }
    };

    rightElement = () => (
        <TouchableOpacity
            style={{
                backgroundColor: colors.PRIMARY_COLOR,
                width: 55,
                height: 50,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Icon name="adduser" size={30} color="#fff" />
        </TouchableOpacity>
    );

    renderScene = ({ route }) => {
        // if (global.offlineNotification === true) {
        //   this.setState({
        //     index: 1,
        //   }, () => {
        //     global.offlineNotification = false

        //   })
        // }
        switch (route.key) {
            case 0:
                return (
                    <View key={route.key} style={{ flex: 1, backgroundColor: '#fff' }}>
                        {/* {
              this.state.loading === true ?
                (
                  <View style={styles.spinner}>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                ) : (
                  <ScrollView style={{ flex: 1 }}>
                    {this.state.contacts.map(contact => {
                      return (
                        <ListItem
                          leftElement={
                            <Avatar
                              img={
                                contact.hasThumbnail
                                  ? { uri: contact.thumbnailPath }
                                  : undefined
                              }
                              placeholder={getAvatarInitials(
                                `${contact.givenName} ${contact.familyName}`
                              )}
                              width={40}
                              height={40}
                            />
                          }
                          key={contact.recordID}
                          title={`${contact.givenName} ${contact.familyName}`}
                          description={`${contact.company}`}
                          onPress={() => this.onPressContact(contact)}
                          onDelete={() =>
                            Contacts.deleteContact(contact).then(() => {
                              this.loadContacts();
                            })
                          }
                          rightElement={
                            this.rightElement()
                          }
                        />
                      );
                    })}
                  </ScrollView>
                )
            } */}
                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Image
                                source={require('../../assets/Images/emptyInvites.png')}
                                resizeMode={'cover'}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
                            <View style={{ paddingVertical: 15, width: '70%' }}>
                                <Text style={{ fontFamily: fonts.NEWYORKLARGE_MEDIUM, fontSize: 30, textAlign: 'center' }}>
                                    no members yet!
                                </Text>
                            </View>
                            <View style={{ paddingVertical: 15 }}>
                                <Text style={{ fontFamily: fonts.MULISH_REGULAR, fontSize: 18, textAlign: 'center' }}>
                                    don't worry, we soon have {'\n'}some friends to invite!
                                </Text>
                            </View>
                        </View>
                    </View>
                );
            case 1:
                return (
                    <View key={route.key} style={{ flex: 1, backgroundColor: '#fff' }}>
                        {this.state.loading === true ? (
                            <View style={styles.spinner}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        ) : (
                            <View style={{ flex: 1 }}>
                                {this.state.contactsSearch && this.state.contactsSearch.length > 1 ? (
                                    <React.Fragment>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: colors.GREY,
                                                    width: width * 0.9,
                                                    height: height * 0.05,
                                                    borderRadius: 30,
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    paddingHorizontal: 10,
                                                }}>
                                                <Icon
                                                    name="search"
                                                    color={colors.PRIMARY_COLOR}
                                                    size={25}
                                                    style={{ marginHorizontal: 5 }}
                                                />
                                                <TextInput
                                                    onFocus={this.onFocus}
                                                    returnKeyType={'search'}
                                                    // onSubmitEditing={()=>this.handleSearch()}

                                                    style={{
                                                        width: '90%',
                                                        color: colors.BLACK,
                                                        fontFamily: fonts.MULISH_REGULAR,
                                                        fontSize: 15,
                                                        paddingLeft: 20,
                                                    }}
                                                    onChangeText={(pas) => this.search(pas)}
                                                    placeholder={'Search'}
                                                    placeholderTextColor="#999"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <AlphabetList
                                            data={this.state.contactsSearch}
                                            indexLetterColor={'#777'}
                                            style={{ flex: 1 }}
                                            // onPress={(item)=>{
                                            //   console.log(item)
                                            //   // this.selectContactsNew()
                                            // }}
                                            index={[
                                                'A',
                                                'B',
                                                'C',
                                                'D',
                                                'E',
                                                'F',
                                                'G',
                                                'H',
                                                'I',
                                                'J',
                                                'K',
                                                'L',
                                                'M',
                                                'N',
                                                'O',
                                                'P',
                                                'Q',
                                                'R',
                                                'S',
                                                'T',
                                                'U',
                                                'V',
                                                'W',
                                                'X',
                                                'Y',
                                                'Z',
                                            ]}
                                            renderCustomItem={(item) => {
                                                console.log(item);
                                                return (
                                                    <View key={item.key} style={{ flex: 1 }}>
                                                        <ListItem
                                                            leftElement={
                                                                <Avatar
                                                                    img={
                                                                        item.hasThumbnail
                                                                            ? { uri: item.thumbnailPath }
                                                                            : undefined
                                                                    }
                                                                    placeholder={getAvatarInitials(`${item.value}`)}
                                                                    width={40}
                                                                    height={40}
                                                                />
                                                            }
                                                            key={item.key}
                                                            title={`${item.value}`}
                                                            // description={`${contact.company}`}
                                                            onPress={() => {
                                                                let multiple = false;
                                                                item.phoneNumbers.length > 1
                                                                    ? (multiple = true)
                                                                    : (multiple = false);
                                                                this.selectContactsNew(
                                                                    multiple ? item : item.phoneNumbers[0].number,
                                                                    multiple,
                                                                );
                                                            }}
                                                            rightElement={
                                                                this.state.selectedContacts[
                                                                    item.phoneNumbers.length === 1
                                                                        ? item.phoneNumbers[0].number
                                                                        : undefined
                                                                ] ? (
                                                                    <Icon
                                                                        name="check-circle"
                                                                        color={colors.PRIMARY_COLOR}
                                                                        size={25}
                                                                        style={{ right: -10 }}
                                                                    />
                                                                ) : null
                                                            }
                                                        />
                                                    </View>
                                                );
                                            }}
                                            renderCustomSectionHeader={(section) => (
                                                <View style={{ marginLeft: 15, paddingVertical: 10 }}>
                                                    <Text style={{ fontFamily: fonts.MULISH_SEMI_BOLD, fontSize: 15 }}>
                                                        {section.title}
                                                    </Text>
                                                </View>
                                            )}
                                            keyExtractor={(index) => index}
                                        />
                                    </React.Fragment>
                                ) : (
                                    <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'flex-start' }}>
                                            <Image
                                                source={require('../../assets/Images/emptyInvites.png')}
                                                resizeMode={'cover'}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </View>
                                        <View
                                            style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
                                            <View style={{ paddingVertical: 15, width: '70%' }}>
                                                <Text
                                                    style={{
                                                        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
                                                        fontSize: 30,
                                                        textAlign: 'center',
                                                    }}>
                                                    no contacts yet!
                                                </Text>
                                            </View>
                                            <View style={{ paddingVertical: 15 }}>
                                                <Text
                                                    style={{
                                                        fontFamily: fonts.MULISH_REGULAR,
                                                        fontSize: 18,
                                                        textAlign: 'center',
                                                    }}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            Contacts.getAll().then((contacts) => {
                                                                this.setState({ contactsSearch: contacts });
                                                            });
                                                        }}>
                                                        <Text style={{ fontWeight: 'bold' }}>allow access</Text>{' '}
                                                    </TouchableOpacity>{' '}
                                                    to your contacts {'\n'}
                                                    or <Text style={{ fontWeight: 'bold' }}>invite your frineds </Text>to make
                                                    users {'\n'}
                                                    appear in this feed
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                );

            default:
                return null;
        }
    };

    async componentDidMount() {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: 'Contacts',
                message: 'This app would like to view your contacts.',
            }).then(() => {
                this.loadContacts();
            });
        } else {
            this.loadContacts();
        }
    }

    loadContacts() {
        Contacts.getAll()
            .then((contacts) => {
                // this.setState({ contacts, loading: false });
                console.log(contacts);
                let temp = [];
                contacts.map((item, index) => {
                    temp[index] = {
                        value: item.givenName + ' ' + item.familyName,
                        phoneNumbers: item.phoneNumbers,
                        thumbnailPath: item.thumbnailPath,
                        hasThumbnail: item.hasThumbnail,
                        key: index,
                    };
                });
                this.setState({
                    contacts: temp,
                    contactsSearch: temp,
                    loading: false,
                });
            })
            .catch((e) => {
                this.setState({ loading: false });
            });

        Contacts.getCount().then((count) => {
            this.setState({ searchPlaceholder: `Search ${count} contacts` });
        });

        Contacts.checkPermission();
    }

    search(pas) {
        // const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
        // const emailAddressRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        // if (text === "" || text === null) {
        //   this.loadContacts();
        //  }
        // //else if (phoneNumberRegex.test(text)) {
        // //   Contacts.getContactsByPhoneNumber(text).then(contacts => {
        // //     this.setState({ contacts });
        // //   });
        // // } else if (emailAddressRegex.test(text)) {
        // //   Contacts.getContactsByEmailAddress(text).then(contacts => {
        // //     this.setState({ contacts });
        // //   });
        // // }
        //  else {
        //   Contacts.getContactsMatchingString(text).then(contacts => {
        //     let temp = []
        //     contacts.map((item, index) => {
        //       temp[index] = {
        //         value: item.givenName + " " + item.familyName,
        //         phoneNumbers: item.phoneNumbers,
        //         thumbnailPath:item.thumbnailPath,
        //         hasThumbnail:item.hasThumbnail
        //       }
        //     })
        //     this.setState({
        //       contacts: temp,
        //     })
        //   });
        // }
        if (this.state.contactsSearch) {
            console.log(this.state.contactsSearch);
            if (pas) {
                let data2 = [];
                for (let i = 0; i < this.state.contacts.length; i++) {
                    if (this.state.contacts[i].value.toLowerCase().indexOf(pas.toLowerCase()) != -1) {
                        console.log(data2);
                        data2.push(this.state.contacts[i]);
                        this.setState({ contactsSearch: data2 });
                    }
                }
            } else {
                this.setState({ contactsSearch: this.state.contacts });
            }
        }
    }

    onPressContact(contact) {
        var text = this.state.typeText;
        this.setState({ typeText: null });
        if (text === null || text === '') Contacts.openExistingContact(contact);
        else {
            var newPerson = {
                recordID: contact.recordID,
                phoneNumbers: [{ label: 'mobile', number: text }],
            };
            Contacts.editExistingContact(newPerson).then((contact) => {
                //contact updated
            });
        }
    }

    addNew() {
        Contacts.openContactForm({}).then((contact) => {
            // Added new contact
            this.setState(({ contacts }) => ({
                contacts: [contact, ...contacts],
                loading: false,
            }));
        });
    }

    render() {
        console.log(Object.keys(this.state.selectedContacts));
        console.log(this.state.contactsSearch, 'contactsSearch');
        return (
            <SafeAreaView style={styles.container}>
                {/* <View
          style={{
            paddingLeft: 100,
            paddingRight: 100,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
        </View> */}
                {/* <Button title={`Proceed for Now`}
         onPress={() => this.props.navigation.navigate('TurnOnNotifications')}
        //  onPress={() => this.addNew()}
         /> */}
                {/* <SearchBar
          searchPlaceholder={this.state.searchPlaceholder}
          onChangeText={this.search}
        /> */}
                <TabView
                    navigationState={this.state}
                    renderScene={this.renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={this._handleIndexChange}
                    swipeEnabled={false}
                />
                {/* <TouchableOpacity style={{justifyContent:"center",alignItems:"center",paddingVertical:10,backgroundColor:colors.PRIMARY_COLOR,width:"50%",borderRadius:10,alignSelf:"center",marginBottom:10}}
          onPress={() => this.props.navigation.navigate('TurnOnNotifications')}
        >
          <Text style={{color:"#fff"}}>Proceed for now</Text>
        </TouchableOpacity> */}
                <Button
                    text={
                        Object.keys(this.state.selectedContacts).length > 0
                            ? `send invite(${Object.keys(this.state.selectedContacts).length})`
                            : 'next'
                    }
                    height={height * 0.08}
                    style={{ marginVertical: 10 }}
                    onPress={() => {
                        // this.RBSheet2.open()
                        if (Object.keys(this.state.selectedContacts).length > 0) {
                            Linking.openURL(
                                `sms:&addresses=${Object.keys(this.state.selectedContacts).join()}&body=Add me on Willow`,
                            );
                        }
                        this.props.navigation.navigate('TurnOnNotifications');
                    }}
                />

                <RBSheet
                    ref={(ref) => {
                        this.RBSheet2 = ref;
                    }}
                    height={400}
                    animationType={'slide'}
                    closeOnDragDown={true}
                    openDuration={250}
                    customStyles={{
                        container: {
                            justifyContent: 'center',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                        },
                    }}>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', marginBottom: 10 }}>
                        <Avatar
                            img={this.state.person?.hasThumbnail ? { uri: this.state.person.thumbnailPath } : undefined}
                            placeholder={getAvatarInitials(`${this.state.person?.value}`)}
                            width={40}
                            height={40}
                        />
                        <Text style={{ fontFamily: fonts.MULISH_SEMI_BOLD, fontSize: 15, marginLeft: 20 }}>
                            {this.state.person?.value}
                        </Text>
                    </View>
                    <FlatList
                        //  numColumns={3}
                        contentContainerStyle={{}}
                        data={this.state.seletionContacts}
                        //  showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View>
                                    {/* <TouchableOpacity style={{ margin: 8}} >
                    <Text>{item.number}</Text>
                  </TouchableOpacity> */}

                                    <ListItem
                                        key={item.key}
                                        title={item.number}
                                        // description={`${contact.company}`}
                                        onPress={() => this.selectContactsNew(item.number, false)}
                                        rightElement={
                                            this.state.selectedContacts[item.number] ? (
                                                <Icon
                                                    name="check-circle"
                                                    color={colors.PRIMARY_COLOR}
                                                    size={25}
                                                    style={{ right: -10 }}
                                                />
                                            ) : null
                                        }
                                    />
                                </View>
                            );
                        }}
                    />
                    <Button
                        text={'save'}
                        height={height * 0.08}
                        style={{ top: -20 }}
                        onPress={() => {
                            this.RBSheet2.close();
                            // this.props.navigation.navigate('TurnOnNotifications')
                        }}
                    />
                </RBSheet>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    spinner: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
    },
    inputStyle: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        textAlign: 'center',
    },
});

const getAvatarInitials = (textString) => {
    if (!textString) return '';

    const text = textString.trim();

    const textSplit = text.split(' ');

    if (textSplit.length <= 1) return text.charAt(0);

    const initials = textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);

    return initials;
};
