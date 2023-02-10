import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MilkBottle from './MilkBottle';
const { height } = Dimensions.get('window');

const FloatingMilkBottle = ({ children, milkBottles }) => {
    return (
        <React.Fragment>
            {children &&
                children.map((child, index) => {
                    return React.cloneElement(child, { key: index });
                })}

            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                {milkBottles.map(({ animation, start }, index) => {
                    const positionInterpolate = animation.interpolate({
                        inputRange: [0, height],
                        outputRange: [height - 20, 0],
                    });

                    const opacityInterpolate = animation.interpolate({
                        inputRange: [200, height],
                        outputRange: [0, 1],
                    });

                    const scaleInterpolate = animation.interpolate({
                        inputRange: [0, height - 100, height],
                        outputRange: [1, 1.2, 0],
                        extrapolate: 'clamp',
                    });
                    const dividedHeight = height / 6;
                    const wobbleInterpolate = animation.interpolate({
                        inputRange: [
                            0,
                            dividedHeight * 1,
                            dividedHeight * 2,
                            dividedHeight * 3,
                            dividedHeight * 4,
                            dividedHeight * 5,
                            dividedHeight * 6,
                        ],
                        outputRange: [0, 15, -15, 15, -15, 15, -15],
                        extrapolate: 'clamp',
                    });
                    const heartStyle = {
                        left: start,
                        opacity: opacityInterpolate,
                        transform: [
                            {
                                translateY: positionInterpolate,
                            },
                            { scale: scaleInterpolate },
                            { translateX: wobbleInterpolate },
                        ],
                    };
                    return <MilkBottle key={index} style={heartStyle} />;
                })}
            </View>
        </React.Fragment>
    );
};

export default FloatingMilkBottle;

const styles = StyleSheet.create({});
