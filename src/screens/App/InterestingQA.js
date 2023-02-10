import React from 'react';
import { StyleSheet, FlatList, View, Text, SafeAreaView } from 'react-native';
import { colors, fonts, emoji } from '../../constants';
import { useSelector } from 'react-redux';
import PostCard from '../../components/Profile/PostCard';

const InterestingQA = ({ navigation }) => {
    const interestingQA = useSelector((state) => state.interestingQA.data);
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>interesting q&a {emoji.messages}</Text>
            <View style={{ alignItems: 'center' }}>
                <FlatList
                    contentContainerStyle={styles.contentContainer}
                    keyExtractor={(item) => item.id}
                    data={interestingQA}
                    renderItem={({ item }) => {
                        return <PostCard item={item} navigation={navigation} />;
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default InterestingQA;

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
        paddingBottom: 150,
    },
});
