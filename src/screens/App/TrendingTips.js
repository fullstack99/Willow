import React from 'react';
import { StyleSheet, FlatList, Text, SafeAreaView } from 'react-native';
import { colors, fonts, emoji } from '../../constants';
import { useSelector } from 'react-redux';
import TrendingTip from '../../components/TrendingTip';

const TrendingTips = ({ navigation }) => {
    const trendingTips = useSelector((state) => state.trendingTips.data);
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>trending tips {emoji.thunder}</Text>
            <FlatList
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                data={trendingTips}
                contentContainerStyle={styles.contentContainer}
                renderItem={({ item }) => {
                    return <TrendingTip data={item} navigation={navigation} width={'48%'} />;
                }}
            />
        </SafeAreaView>
    );
};

export default TrendingTips;

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
