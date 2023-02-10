import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { PickerIOS } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import GlobalStyles from '../../constants/globalStyles';
import { fonts } from '../../constants';
import * as COUNTRY_CONSTANTS from '../../constants/Country';
const { height, width } = Dimensions.get('window');

const CountryPickerDialog = ({ forwardRef, country, onSelectCountry }) => {
    const insets = useSafeAreaInsets();
    return (
        <RBSheet
            ref={forwardRef}
            height={height * 0.35}
            animationType={'slide'}
            dragFromTopOnly
            closeOnPressMask
            openDuration={250}
            customStyles={{
                container: GlobalStyles.dialogContainer,
            }}>
            <View style={[GlobalStyles.alignCenterContainer, { marginBottom: insets.bottom + 20 }]}>
                <Text style={styles.title}>choose country</Text>
                <PickerIOS selectedValue={country} onValueChange={onSelectCountry} style={styles.pickerStyle}>
                    {COUNTRY_CONSTANTS.countryLists.map((o) => (
                        <PickerIOS.Item
                            key={o[COUNTRY_CONSTANTS.ISOCODE]}
                            label={o[COUNTRY_CONSTANTS.NAME].toLowerCase()}
                            value={o[COUNTRY_CONSTANTS.ISOCODE]}
                        />
                    ))}
                </PickerIOS>
            </View>
        </RBSheet>
    );
};

CountryPickerDialog.defaultProps = {
    country: COUNTRY_CONSTANTS.US,
};

CountryPickerDialog.propTypes = {
    forwardRef: PropTypes.object.isRequired,
    country: PropTypes.oneOf(COUNTRY_CONSTANTS.countryLists.map((country) => country[COUNTRY_CONSTANTS.ISOCODE])),
    onSelectCountry: PropTypes.func.isRequired,
};

export default CountryPickerDialog;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        marginVertical: 20,
    },
    pickerStyle: {
        height: height * 0.3,
        width,
    },
});
