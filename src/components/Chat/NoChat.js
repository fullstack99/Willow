import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { colors, fonts, emoji } from '../../constants';
import { ADD_FRIEND, CHATTING } from '../../navigator/constants';
import EmptyChatImg from '../../assets/Images/emptyInvites.png';

const { width } = Dimensions.get('window');

const EmptyChat = ({ navigation }) => {
    const addUser = () => navigation.navigate(ADD_FRIEND);

    return (
        <View style={styles.container}>
            <Image source={EmptyChatImg} resizeMode="contain" style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>no chats yet</Text>
                <Text style={styles.textOne}>
                    click the text below to search and follow other users. then you can begin chatting with friends
                </Text>
                <TouchableOpacity onPress={addUser}>
                    <Text style={styles.textTwo}>start making friends on Willow {emoji.cool}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EmptyChat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        alignItems: 'center',
    },
    viewContainer: {
        flex: 1,
        backgroundColor: colors.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: width * 0.9,
        height: width * 0.9,
    },
    textContainer: {
        paddingHorizontal: 20,
        width: '80%',
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontFamily: fonts.NEWYORKEXTRALARGE_BLACK,
        fontSize: 24,
        fontWeight: '500',
        color: colors.BLACK,
        marginBottom: 20,
    },
    textOne: {
        textAlign: 'center',
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        fontWeight: 'normal',
        opacity: 0.8,
        marginBottom: 10,
    },
    textTwo: {
        textAlign: 'center',
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        fontWeight: '600',
    },
});
