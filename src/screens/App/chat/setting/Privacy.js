import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Switch } from 'react-native';

import Header from '../../../../components/Chat/Header';
import { colors, fonts } from '../../../../constants';

const Privacy = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    const goBack = () => navigation.goBack();

    return (
        <SafeAreaView style={styles.container}>
            <Header enabledBack={true} title="privacy" goBack={goBack} />
            <View style={styles.textContainer}>
                <Text style={styles.text}>Make the chat open</Text>
                <Switch
                    trackColor={{ false: colors.GREY_2, true: colors.PRIMARY_COLOR }}
                    thumbColor={colors.WHITE_2}
                    ios_backgroundColor={colors.GREY_2}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    textContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 25,
    },
    text: {
        textAlign: 'center',
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.BLACK,
    },
});
export default Privacy;
