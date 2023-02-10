import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import LightBox from 'react-native-lightbox-v2';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants';

const ChatImage = ({ type, image, openImageDialog }) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [lightboxWidth, setLightBoxWidth] = useState(0);
    const [lightboxHeight, setLightBoxHeight] = useState(0);
    const [maxWidth, setMaxWidth] = useState(Dimensions.get('window').width * 0.7);

    const setAspectRatio = (evt) => {
        const maxHeight = Dimensions.get('window').height;
        const ratio = Math.min(maxWidth / evt.nativeEvent.width, maxHeight / evt.nativeEvent.height);
        setWidth(evt.nativeEvent.width * ratio);
        setHeight(evt.nativeEvent.height * ratio);
    };

    const setLightBoxAspectRation = (evt) => {
        const maxHeight = Dimensions.get('window').height;
        const maxWidth = Dimensions.get('window').width;
        const ratio = Math.min(maxWidth / evt.nativeEvent.width, maxHeight / evt.nativeEvent.height);
        setLightBoxWidth(evt.nativeEvent.width * ratio);
        setLightBoxHeight(evt.nativeEvent.height * ratio);
    };

    const _renderHeader = (close) => {
        return (
            <TouchableOpacity onPress={close} style={styles.closeButton}>
                <Ionicons name="close" color="black" size={40} />
            </TouchableOpacity>
        );
    };

    return (
        <View
            style={styles.container}
            onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                setMaxWidth(Math.max(width, Dimensions.get('window').width * 0.55));
            }}>
            <LightBox
                springConfig={{ useNativeDriver: false }}
                onLongPress={openImageDialog}
                backgroundColor={colors.WHITE}
                renderHeader={_renderHeader}
                renderContent={() => (
                    <FastImage
                        source={{ uri: image.image_url }}
                        style={{ width: lightboxWidth, height: lightboxHeight }}
                        resizeMode={FastImage.resizeMode.contain}
                        onLoad={setLightBoxAspectRation}
                    />
                )}>
                <FastImage
                    source={{ uri: image.image_url }}
                    style={[styles.image, { width, height }]}
                    resizeMode={FastImage.resizeMode.contain}
                    onLoad={setAspectRatio}
                />
            </LightBox>
        </View>
    );
};

export default ChatImage;

const styles = StyleSheet.create({
    container: {},
    image: {
        borderRadius: 25,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 999,
    },
});
