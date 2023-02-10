import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CoverImage from '../../assets/Images/discover.png';
import { SEARCH } from '../../navigator/constants';
import { emoji, colors, fonts } from '../../constants';
const { width } = Dimensions.get('window');

const DiscoverHeader = ({ navigation }) => {
    return (
        <ImageBackground source={CoverImage} style={styles.image} resizeMode="cover">
            <View style={styles.container}>
                <Text style={styles.title}>
                    let's dive into {'\n'} the w<Text style={{ fontSize: 25 }}>{emoji.world}</Text>
                    rld of willow
                </Text>
                <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate(SEARCH)}>
                    <Icon name="search" color={colors.PRIMARY_COLOR} size={25} style={styles.searchIcon} />
                    <Text style={styles.searchText}>what are you looking for?</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default DiscoverHeader;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    image: {
        width: '100%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    title: {
        color: colors.BLACK,
        fontFamily: fonts.NEWYORKEXTRALARGE_SEMIBOLD,
        fontSize: 30,
        color: colors.WHITE,
        textAlign: 'center',
    },
    searchBar: {
        backgroundColor: colors.WHITE,
        width: width * 0.9,
        borderRadius: 30,
        flex: 0.55,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    searchIcon: {
        marginHorizontal: 5,
    },
    searchText: {
        color: '#999',
        opacity: 0.7,
        fontFamily: fonts.MULISH_REGULAR,
    },
});
