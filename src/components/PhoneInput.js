import React, { useRef } from 'react';
import { StyleSheet, Text, View, ViewPropTypes, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Input from 'react-native-phone-input';
import TextInputMask from 'react-native-text-input-mask';
import CountryPickerDialog from './Dialogs/CountryPickerDialog';
import { colors, fonts } from '../constants';
import * as COUNTRY_CONSTANTS from '../constants/Country';

const PhoneInput = ({
    height,
    autoFocus,
    containerStyle,
    titleStyle,
    inputContainerStyle,
    phoneInputContainerStyle,
    phoneInputTextStyle,
    numberInputTextStyle,
    infoContainerStyle,
    infoClickable,
    infoText,
    infoOnPress,
    onChangeText,
    value,
    country,
    onSelectCountry,
}) => {
    const phoneInputRef = useRef();
    const countryPickerDialogRef = useRef();
    const _toggleCountryPicker = () => {
        countryPickerDialogRef.current && countryPickerDialogRef.current.open();
    };
    return (
        <View style={[styles.container, containerStyle, { height }]}>
            <Text style={[styles.title, titleStyle, { fontSize: value ? 14 : 18 }]}>mobile number</Text>
            <View style={[styles.inputContainer, inputContainerStyle]}>
                <Input
                    ref={phoneInputRef}
                    value={COUNTRY_CONSTANTS.countryCodes[country]}
                    textProps={{ editable: false }}
                    onPressFlag={_toggleCountryPicker}
                    offset={10}
                    style={[styles.phoneInputContainer, phoneInputContainerStyle]}
                    textStyle={[styles.phoneInputText, phoneInputTextStyle]}
                    countriesList={COUNTRY_CONSTANTS.countryLists}
                />
                <View style={styles.numberInputContainer}>
                    <TextInputMask
                        autoCorrect={false}
                        autoFocus={autoFocus}
                        keyboardType={'number-pad'}
                        mask={COUNTRY_CONSTANTS.countryMasks[country]}
                        placeholder={COUNTRY_CONSTANTS.countryPlaceholder[country]}
                        style={[styles.numberInputText, numberInputTextStyle]}
                        onChangeText={onChangeText}
                        value={value}
                    />
                    {infoClickable ? (
                        <TouchableOpacity style={[styles.infoContainer, infoContainerStyle]} onPress={infoOnPress}>
                            <Text style={styles.infoText}>{infoText}</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={[styles.infoContainer, infoContainerStyle]}>
                            <Text style={styles.infoText}>{infoText}</Text>
                        </View>
                    )}
                </View>
            </View>
            <CountryPickerDialog forwardRef={countryPickerDialogRef} country={country} onSelectCountry={onSelectCountry} />
        </View>
    );
};

PhoneInput.defaultProps = {
    height: Dimensions.get('window').height * 0.15,
    autoFocus: false,
    infoText: '',
    infoClickable: false,
    infoOnPress: () => {},
};

PhoneInput.propTypes = {
    height: PropTypes.number.isRequired,
    autoFocus: PropTypes.bool.isRequired,
    containerStyle: ViewPropTypes.style,
    titleStyle: PropTypes.object,
    inputContainerStyle: ViewPropTypes.style,
    phoneInputContainerStyle: ViewPropTypes.style,
    infoContainerStyle: ViewPropTypes.style,
    infoClickable: PropTypes.bool.isRequired,
    infoOnPress: PropTypes.func,
    onChangeText: PropTypes.func.isRequired,
    country: PropTypes.oneOf(COUNTRY_CONSTANTS.countryLists.map((country) => country[COUNTRY_CONSTANTS.ISOCODE])),
    onSelectCountry: PropTypes.func.isRequired,
};

export default PhoneInput;

const styles = StyleSheet.create({
    container: {},
    title: {
        marginBottom: 20,
        fontFamily: fonts.NEUTRA_BOOK,
        fontSize: 18,
        color: '#a2a2a2',
    },
    inputContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    phoneInputContainer: {
        flex: 0.3,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#a2a2a2',
    },
    phoneInputText: {
        fontSize: 18,
        fontFamily: fonts.MULISH_SEMI_BOLD,
        color: colors.BLACK,
    },
    numberInputContainer: {
        flex: 0.77,
        marginLeft: 30,
    },
    numberInputText: {
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#a2a2a2',
        fontSize: 20,
    },
    infoContainer: {
        position: 'absolute',
        bottom: -20,
        width: '100%',
        // alignItems: 'center',
    },
    infoText: {
        fontFamily: fonts.NEUTRA_BOOK,
        fontSize: 14,
        color: '#A2A2A2',
    },
});
