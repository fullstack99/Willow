import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Contacts from 'react-native-contacts';
import RBSheet from 'react-native-raw-bottom-sheet';

import { colors, fonts } from '../../constants';
import Button from '../Button';

const AllowContacts = () => {
    return (
        <SafeAreaView style={styles.container}>
            <RBSheet
                ref={(ref) => {
                    this.RBSheet = ref;
                }}
                height={350}
                animationType={'slide'}
                closeOnDragDown={true}
                openDuration={250}
                customStyles={{
                    container: {
                        justifyContent: 'flex-start',
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    },
                }}>
                <View style={styles.viewContainer}>
                    <Text style={styles.title}>Allow access to your contacts</Text>
                    <Text style={styles.description}>
                        This will help us unite your contacts and unite you in the application.
                    </Text>
                    <Button
                        height={60}
                        onPress={() => {
                            Contacts.getAll().then((contacts) => {
                                console.log(contacts);
                            });
                            this.RBSheet.close();
                        }}>
                        Yes
                    </Button>

                    <TouchableOpacity onPress={() => this.RBSheet.close()}>
                        <Text style={styles.closeBtn}>no, thanks</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    viewContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20,
    },
    description: {
        textAlign: 'center',
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        marginVertical: 20,
        width: '85%',
    },
    closeBtn: {
        color: colors.GREY_1,
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 16,
    },
});

export default AllowContacts;
