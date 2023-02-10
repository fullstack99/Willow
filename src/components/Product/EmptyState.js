import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EmptyList from '../../assets/Images/emptylist.svg';
import { fonts } from '../../constants';

const EmptyState = ({ title }) => {
    return (
        <View style={styles.container}>
            <EmptyList style={styles.image} />
            <Text style={styles.text}>{title}</Text>
        </View>
    );
};

export default EmptyState;

const styles = StyleSheet.create({
    container: {
        marginVertical: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    text: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 20,
        paddingTop: 30,
        textAlign: 'center',
    },
});
