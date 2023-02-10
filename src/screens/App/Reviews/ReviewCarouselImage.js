import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
const { width, height } = Dimensions.get('window');

const ReviewCarouselImage = ({ uri }) => {
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);

    const setAspectRatio = (evt) => {
        const maxHeight = height;
        const maxWidth = width - 40;
        const ratio = Math.min(maxWidth / evt.nativeEvent.width, maxHeight / evt.nativeEvent.height);
        setImageWidth(evt.nativeEvent.width * ratio);
        setImageHeight(evt.nativeEvent.height * ratio);
    };

    return (
        <FastImage
            source={{ uri }}
            resizeMode={FastImage.resizeMode.contain}
            style={{ width: imageWidth, height: imageHeight, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            onLoad={setAspectRatio}
        />
    );
};

ReviewCarouselImage.propTypes = {
    uri: PropTypes.string.isRequired,
};

export default ReviewCarouselImage;

const styles = StyleSheet.create({});
