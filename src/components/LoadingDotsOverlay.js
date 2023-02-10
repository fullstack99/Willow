import React from 'react';
import { StyleSheet, View, ViewPropTypes, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import LoadingDots from 'react-native-loading-dots';
import Spinner from 'react-native-loading-spinner-overlay';
import { colors } from '../constants';

const LoadingDotsOverlay = ({ animation, style, dots, colors, size }) => {
    if (!animation) return null;
    return (
        <Spinner
            visible={animation}
            animation="fade"
            customIndicator={
                <View style={[styles.dotContainer, style]}>
                    <LoadingDots dots={dots} colors={colors} size={size} />
                </View>
            }
        />
    );
};

LoadingDotsOverlay.defaultProps = {
    animation: false,
    dots: 4,
    colors: ['#6AC3C1', '#B5E1E0', '#DADED3', '#E0E4DB'],
    size: 20,
};

LoadingDotsOverlay.propTypes = {
    animation: PropTypes.bool.isRequired,
    style: ViewPropTypes.style,
    dots: PropTypes.number.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    size: PropTypes.number.isRequired,
};

export default LoadingDotsOverlay;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: Dimensions.get('screen').height,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    },
    dotContainer: {
        width: 100,
    },
});
