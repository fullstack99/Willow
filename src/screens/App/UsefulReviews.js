import React from 'react';
import { StyleSheet, FlatList, Text, SafeAreaView } from 'react-native';
import { colors, fonts, emoji } from '../../constants';
import { useSelector } from 'react-redux';
import UsefulReview from '../../components/UsefulReviews';

const UsefulReviews = ({ navigation }) => {
    const usefulReviews = useSelector((state) => state.usefulReviews.data);
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>useful reviews {emoji.excited}</Text>
            <FlatList
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                data={usefulReviews}
                contentContainerStyle={styles.contentContainer}
                renderItem={({ item }) => {
                    return <UsefulReview data={item} navigation={navigation} width={'48%'} />;
                }}
            />
        </SafeAreaView>
    );
};

export default UsefulReviews;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    title: {
        marginLeft: 20,
        marginVertical: 10,
        fontFamily: fonts.NEWYORKEXTRALARGE_SEMIBOLD,
        fontSize: 24,
    },
    contentContainer: {
        marginHorizontal: 20,
        paddingBottom: 80,
    },
});
