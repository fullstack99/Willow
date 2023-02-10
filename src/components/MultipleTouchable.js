import React, { useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

const MultipleTouchable = ({ children, disabled, onSingleTap, onDoubleTap, onLongPress, delay, style }) => {
    const lastTap = useRef(0);

    const onPress = () => {
        const timeNow = Date.now();
        if (lastTap.current && timeNow - lastTap.current < delay) {
            onDoubleTap();
            lastTap.current = 0;
        } else {
            lastTap.current = timeNow;
            setTimeout(() => {
                if (lastTap.current) {
                    onSingleTap();
                } else {
                    lastTap.current = 0;
                }
            }, delay);
        }
    };
    return (
        <TouchableOpacity disabled={disabled} style={[styles.container, style]} onPress={onPress} onLongPress={onLongPress}>
            {children}
        </TouchableOpacity>
    );
};

MultipleTouchable.defaultProps = {
    children: <View />,
    disabled: false,
    delay: 300,
    style: {},
    onSingleTap: () => console.log('single tap'),
    onDoubleTap: () => console.log('double tap'),
    onLongPress: () => console.log('long press'),
};

MultipleTouchable.propTypes = {
    children: PropTypes.element,
    disabled: PropTypes.bool.isRequired,
    delay: PropTypes.number.isRequired,
    style: ViewPropTypes.style,
    onSingleTap: PropTypes.func.isRequired,
    onDoubleTap: PropTypes.func.isRequired,
    onLongPress: PropTypes.func.isRequired,
};

export default MultipleTouchable;

const styles = StyleSheet.create({
    container: {},
});
