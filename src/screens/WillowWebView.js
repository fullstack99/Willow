import React, { useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import LoadingDots from 'react-native-loading-dots';
import GlobalStyles from '../constants/globalStyles';

const WillowWebView = ({ navigation, route, dots, colors, size }) => {
    const uri = route.params?.uri || 'https://www.willow.app';
    const title = route.params?.title || '';

    useLayoutEffect(() => {
        navigation &&
            navigation.setOptions({
                title,
            });
    }, [navigation, title]);
    return (
        <SafeAreaView style={GlobalStyles.container}>
            <WebView
                source={{ uri }}
                startInLoadingState
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <LoadingDots dots={dots} colors={colors} size={size} />
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

WillowWebView.defaultProps = {
    dots: 4,
    colors: ['#6AC3C1', '#B5E1E0', '#DADED3', '#E0E4DB'],
    size: 20,
};

export default WillowWebView;

const styles = StyleSheet.create({
    loadingContainer: {
        marginBottom: 50,
        paddingHorizontal: 100,
    },
});
