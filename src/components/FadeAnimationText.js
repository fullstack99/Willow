import React, { useState, useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';
import PropTypes from 'prop-types';

const FadeAnimationText = ({ showText, animationTime, style, children, onFinish }) => {
    const [animation, setAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animation, {
            toValue: showText ? 1 : 0,
            duration: animationTime,
            useNativeDriver: true,
        }).start(({ finished }) => {
            finished && onFinish && onFinish();
        });
    }, [showText]);

    return (
        <Animated.View style={{ transform: [{ scale: animation }] }}>
            <Text style={style}>{children}</Text>
        </Animated.View>
    );
};

FadeAnimationText.defaultProps = {
    showText: false,
    animationTime: 1000,
    style: {},
};

FadeAnimationText.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    showText: PropTypes.bool.isRequired,
    animationTime: PropTypes.number.isRequired,
    onFinish: PropTypes.func,
};

export default FadeAnimationText;
