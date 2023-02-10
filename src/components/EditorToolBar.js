import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const ControlButton = ({ text, action, isActive }) => {
    return (
        <TouchableOpacity style={[styles.controlButtonContainer, isActive ? { backgroundColor: 'gold' } : {}]} onPress={action}>
            <Text>{text}</Text>
        </TouchableOpacity>
    );
};

const EditorToolBar = ({ activeStyles, blockType, toggleStyle, toggleBlockType }) => {
    return (
        <View style={styles.toolbarContainer}>
            <ControlButton text={'B'} isActive={activeStyles.includes('BOLD')} action={() => toggleStyle('BOLD')} />
            <ControlButton text={'I'} isActive={activeStyles.includes('ITALIC')} action={() => toggleStyle('ITALIC')} />
            <ControlButton text={'H'} isActive={blockType === 'header-one'} action={() => toggleBlockType('header-one')} />
            <ControlButton
                text={'ul'}
                isActive={blockType === 'unordered-list-item'}
                action={() => toggleBlockType('unordered-list-item')}
            />
            <ControlButton
                text={'ol'}
                isActive={blockType === 'ordered-list-item'}
                action={() => toggleBlockType('ordered-list-item')}
            />
            <ControlButton
                text={'--'}
                isActive={activeStyles.includes('STRIKETHROUGH')}
                action={() => toggleStyle('STRIKETHROUGH')}
            />
        </View>
    );
};

export default EditorToolBar;

const styles = StyleSheet.create({
    toolbarContainer: {
        height: 56,
        flexDirection: 'row',
        backgroundColor: 'silver',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    controlButtonContainer: {
        padding: 8,
        borderRadius: 2,
    },
});
