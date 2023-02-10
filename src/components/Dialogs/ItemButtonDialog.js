import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import RBSheet from 'react-native-raw-bottom-sheet';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import Button from '../Button';

const ItemButtonDialog = ({ forwardRef, added, onPress, onAmazonPress }) => {
    if (!forwardRef) return null;
    const insets = useSafeAreaInsets();
    return (
        <RBSheet
            ref={forwardRef}
            height={300}
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
                {added !== null && (
                    <Button
                        style={{ marginTop: 0, backgroundColor: added ? colors.GREY_4 : colors.PRIMARY_COLOR }}
                        textStyle={{ color: added ? colors.BLACK : colors.WHITE }}
                        onPress={onPress}>
                        {added ? 'remove from my items' : 'add to my items'}
                    </Button>
                )}
                <TouchableOpacity onPress={onAmazonPress}>
                    <Text style={styles.amazon}>buy item on Amazon</Text>
                </TouchableOpacity>
            </View>
        </RBSheet>
    );
};

ItemButtonDialog.propTypes = {
    forwardRef: PropTypes.object.isRequired,
    added: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    onAmazonPress: PropTypes.func.isRequired,
};

export default ItemButtonDialog;

const styles = StyleSheet.create({
    amazon: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 16,
        color: colors.PRIMARY_COLOR,
    },
});
