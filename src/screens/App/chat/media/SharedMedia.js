import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

import Link from './Link';
import Media from './Media';
import Voice from './Voice';
import { colors, fonts } from '../../../../constants';
import Header from '../../../../components/Chat/Header';
import SearchIcon from '../../../../assets/Images/search.svg';
const { width } = Dimensions.get('screen');

const NewChat = ({ navigation }) => {
    const [tabs, setTabs] = useState([
        { key: 0, title: 'gallery', focused: true, onPress: () => selectTab(0) },
        { key: 1, title: 'voice', focused: false, onPress: () => selectTab(1) },
        { key: 2, title: 'links', focused: false, onPress: () => selectTab(2) },
    ]);

    const goBack = () => navigation.goBack();

    const selectTab = (tabKey) => {
        if (tabKey > tabs.length - 1) {
            return;
        }
        return setTabs(tabs.map((t) => (t.key === tabKey ? { ...t, focused: true } : { ...t, focused: false })));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header enabledBack={true} title="shared media" goBack={goBack} />
            <View style={styles.tabBarContainer}>
                {tabs.map((item) => (
                    <TouchableOpacity
                        key={item.key}
                        style={[
                            styles.tabTitleContainer,
                            { borderBottomColor: item.focused ? colors.PRIMARY_COLOR : colors.GREY },
                        ]}
                        onPress={item.onPress}>
                        <Text style={[styles.tabTitle, { color: item.focused ? colors.PRIMARY_COLOR : colors.BLACK }]}>
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Media show={tabs[0].focused} navigation={navigation} />
            <Voice show={tabs[1].focused} navigation={navigation} />
            <Link show={tabs[2].focused} navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        alignItems: 'center',
    },
    tabBarContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    tabTitleContainer: {
        width: width / 3,
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
});
export default NewChat;
