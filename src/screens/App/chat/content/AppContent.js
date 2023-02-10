import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import Tips from './Tips';
import Items from './Items';
import Reviews from './Reviews';
import Questions from './Questions';
import { colors, fonts } from '../../../../constants';
import Header from '../../../../components/Chat/Header';
import ContentHeader from '../../../../components/Chat/ContentHeader';
import WhitePen from '../../../../assets/Images/pen-white.svg';
import GreenPen from '../../../../assets/Images/pen-green.svg';
import WhiteBag from '../../../../assets/Images/bag-white.svg';
import GreenBag from '../../../../assets/Images/bag-green.svg';
import WhiteQuestion from '../../../../assets/Images/question-white.svg';
import GreenQuestion from '../../../../assets/Images/question-green.svg';
import WhiteStar from '../../../../assets/Images/star-white.svg';
import GreenStar from '../../../../assets/Images/pen-green.svg';

const NewChat = ({ navigation }) => {
    const [tabs, setTabs] = useState([
        { key: 0, selectedIcon: <WhiteBag />, icon: <GreenBag />, title: 'items', onPress: () => setSelectedTab(0) },
        { key: 1, selectedIcon: <WhitePen />, icon: <GreenPen />, title: 'tips', onPress: () => setSelectedTab(1) },
        { key: 2, selectedIcon: <WhiteStar />, icon: <GreenStar />, title: 'reviews', onPress: () => setSelectedTab(2) },
        {
            key: 3,
            selectedIcon: <WhiteQuestion />,
            icon: <GreenQuestion />,
            title: 'questions',
            onPress: () => setSelectedTab(3),
        },
    ]);

    const [selectedTab, setSelectedTab] = useState(0);

    const goBack = () => navigation.goBack();

    return (
        <SafeAreaView style={styles.container}>
            <Header enabledBack={true} title="app's content" goBack={goBack} />
            <View style={styles.list}>
                <FlatList
                    data={tabs}
                    renderItem={({ item }) => <ContentHeader item={item} selectedTab={selectedTab} onPress={item.onPress} />}
                    keyExtractor={(item) => item.key}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                />
            </View>
            {selectedTab === 0 && <Items />}
            {selectedTab === 1 && <Tips />}
            {selectedTab === 2 && <Reviews />}
            {selectedTab === 3 && <Questions />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    tabBarContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    tabTitleContainer: {
        width: '25%',
        alignItems: 'center',
        borderBottomColor: colors.GREY,
        borderBottomWidth: 2,
        paddingVertical: 20,
    },
    tabTitle: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
    list: {
        height: 70,
    },
});
export default NewChat;
