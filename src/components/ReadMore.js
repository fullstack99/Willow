import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../constants';

const ReadMore = ({ children, numberOfLines }) => {
    const [readMore, setReadMore] = useState(false);
    const [show, setShow] = useState(false);
    const onTextLayout = useCallback((e) => {
        if (e.nativeEvent.lines.length > numberOfLines) {
            setReadMore(true);
        }
    }, []);
    if (readMore && !show) {
        return (
            <View>
                <Text numberOfLines={numberOfLines} onTextLayout={onTextLayout}>
                    {children}
                </Text>
                <Text style={styles.showMoreText} onPress={() => setShow(true)}>
                    Read more
                </Text>
            </View>
        );
    } else if (readMore && show) {
        return (
            <View>
                <Text onTextLayout={onTextLayout}>{children}</Text>
                <Text
                    style={styles.showMoreText}
                    onPress={() => setShow(false)}>
                    Show less
                </Text>
            </View>
        );
    } else {
        return (
            <View>
                <Text onTextLayout={onTextLayout}>{children}</Text>
            </View>
        );
    }
};

export default ReadMore;

ReadMore.defaultProps = {
    numberOfLines: 4,
};

ReadMore.propTypes = {
    children: PropTypes.element.isRequired,
    numberOfLines: PropTypes.number,
};

const styles = StyleSheet.create({
    showMoreText: {
        fontFamily: fonts.MULISH_BOLD_ITALIC,
        color: colors.BLACK,
        fontSize: 18,
        marginTop: 5,
    },
});
