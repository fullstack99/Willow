import React from 'react';
import { StyleSheet, Animated, View } from 'react-native';

const MilkBotle = ({ style }) => {
    return (
        <Animated.View style={[styles.heart, style]}>
            <View style={[styles.heartShape, styles.leftHeart]} />
            <View style={[styles.heartShape, styles.rightHeart]} />
        </Animated.View>
    );
};

export default MilkBotle;

const styles = StyleSheet.create({
    heart: {
        width: 50,
        height: 50,
        position: 'absolute',
    },
    heartShape: {
        width: 30,
        height: 45,
        position: 'absolute',
        top: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: '#D54F3E',
    },
    leftHeart: {
        transform: [{ rotate: '-45deg' }],
        left: 5,
    },
    rightHeart: {
        transform: [{ rotate: '45deg' }],
        right: 5,
    },
});
