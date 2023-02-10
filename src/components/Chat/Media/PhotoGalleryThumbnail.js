import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { colors } from '../../../constants';

const PhotoGalleryThumbnail = ({ image, index, selected, setSelectedImage }) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const setAspectRatio = (evt) => {
        const maxWidth = Dimensions.get('window').width * 0.3;
        const maxHeight = 300;
        const ratio = Math.min(maxWidth / evt.nativeEvent.width, maxHeight / evt.nativeEvent.height);
        setWidth(evt.nativeEvent.width * ratio);
        setHeight(evt.nativeEvent.height * ratio);
    };

    return (
        <TouchableOpacity
            style={[styles.container, selected && styles.focusedContainer]}
            onPress={() => setSelectedImage({ index, ...image })}>
            <FastImage
                source={{ uri: image?.image_url }}
                style={{ width, height }}
                onLoad={setAspectRatio}
                resizeMode={FastImage.resizeMode.contain}
            />
        </TouchableOpacity>
    );
};

PhotoGalleryThumbnail.propTypes = {
    image: PropTypes.shape({
        image_url: PropTypes.string.isRequired,
    }),
    index: PropTypes.number,
    selected: PropTypes.bool.isRequired,
    setSelectedImage: PropTypes.func.isRequired,
};

export default PhotoGalleryThumbnail;

const styles = StyleSheet.create({
    container: {},
    focusedContainer: {
        borderWidth: 3,
        borderColor: colors.PRIMARY_COLOR,
    },
});
