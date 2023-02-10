import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ViewPropTypes } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

const CustomFastImage = ({ style, imageStyle, borderRadius, source, onPress, maxHeight, maxWidth, resizeMode }) => {
    if (!source) return null;
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const setAspectRatio = (evt) => {
        const ratio = Math.min(maxWidth / evt.nativeEvent.width, maxHeight / evt.nativeEvent.height);
        setWidth(evt.nativeEvent.width * ratio);
        setHeight(evt.nativeEvent.height * ratio);
    };

    if (onPress) {
        <TouchableOpacity onPress={onPress} style={[styles.container, { height, width }, style]}>
            <FastImage source={source} style={[styles.image, { borderRadius }]} resizeMode={resizeMode} onLoad={setAspectRatio} />
        </TouchableOpacity>;
    } else {
        return (
            <View style={[styles.container, { height, width }, style]}>
                <FastImage
                    source={source}
                    style={[styles.image, imageStyle, { borderRadius }]}
                    resizeMode={resizeMode}
                    onLoad={setAspectRatio}
                />
            </View>
        );
    }
};

CustomFastImage.defaultProps = {
    maxHeight: 300,
    maxWidth: Dimensions.get('window').width * 0.8,
    resizeMode: FastImage.resizeMode.contain,
};

CustomFastImage.propTypes = {
    style: ViewPropTypes.style,
    imageStyle: ViewPropTypes.style,
    borderRadius: PropTypes.number,
    source: PropTypes.oneOfType([PropTypes.node, PropTypes.shape({ uri: PropTypes.string.isRequired })]).isRequired,
    onPress: PropTypes.func,
    maxHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    resizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
};

export default CustomFastImage;

const styles = StyleSheet.create({
    container: {},
    image: {
        width: '100%',
        height: '100%',
    },
});
