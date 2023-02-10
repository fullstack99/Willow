import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import RBSheet from 'react-native-raw-bottom-sheet';
import GlobalStyles from '../../constants/globalStyles';
import Button from '../Button';
const { height } = Dimensions.get('window');

const AddPhotoDialog = ({ forwardRef, photo, onChoosePress, onDeletePress }) => {
    if (!forwardRef) return null;
    const insets = useSafeAreaInsets();
    return (
        <RBSheet
            ref={forwardRef}
            height={height * 0.25}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: GlobalStyles.dialogContainer,
            }}>
            <View
                style={[
                    GlobalStyles.alignCenterContainer,
                    { justifyContent: 'space-evenly', width: '100%', marginTop: 10, marginBottom: insets.bottom + 20 },
                ]}>
                <Button style={{ marginTop: 0 }} onPress={onChoosePress}>
                    choose photo
                </Button>
                <TouchableOpacity onPress={onDeletePress} disabled={Boolean(!photo)}>
                    <Text style={[styles.deleteText, { color: photo ? 'red' : '#9d9d9d' }]}>delete</Text>
                </TouchableOpacity>
            </View>
        </RBSheet>
    );
};

AddPhotoDialog.propTypes = {
    forwardRef: PropTypes.object.isRequired,
    photo: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ uri: PropTypes.string })]),
    onChoosePress: PropTypes.func.isRequired,
    onDeletePress: PropTypes.func.isRequired,
};

export default AddPhotoDialog;

const styles = StyleSheet.create({
    deleteText: {
        fontSize: 16,
    },
});
