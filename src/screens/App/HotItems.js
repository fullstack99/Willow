import React from 'react';
import { StyleSheet, FlatList, View, Text, SafeAreaView } from 'react-native';
import { colors, fonts, emoji } from '../../constants';
import { useSelector } from 'react-redux';
import HotItem from '../../components/HotItem';

const HotItems = ({ navigation }) => {
    const hot_items = useSelector((state) => state.products.hot_items);
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>hot items {emoji.fire}</Text>
            <View style={{ alignItems: 'center' }}>
                <FlatList
                    numColumns={2}
                    contentContainerStyle={styles.contentContainer}
                    keyExtractor={(item) => item.position.toString()}
                    data={hot_items}
                    renderItem={({ item }) => {
                        return <HotItem data={item} width={'48%'} navigation={navigation} />;
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default HotItems;

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
