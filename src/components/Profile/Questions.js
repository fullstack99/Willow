import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

const Questions = ({ navigation, user, visible }) => {
    if (!visible) return null;
    return (
        <View>
            <Text></Text>
        </View>
    );
};

Questions.propTypes = {
    navigation: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    visible: PropTypes.bool,
};

export default Questions;

const styles = StyleSheet.create({});
