import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import RBSheet from 'react-native-raw-bottom-sheet';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
const { height } = Dimensions.get('window');

const DatePickerDialog = ({ forwardRef, date, title, onDateChange, clearDate, current, maximumDate, minimumDate }) => {
    return (
        <RBSheet
            ref={forwardRef}
            height={height * 0.7}
            animationType={'slide'}
            openDuration={250}
            customStyles={{
                container: GlobalStyles.dialogContainer,
            }}>
            {typeof title === 'string' && <Text style={styles.warningMessage}>{title}</Text>}
            <DatePicker
                mode="calendar"
                options={{
                    mainColor: colors.PRIMARY_COLOR,
                }}
                onDateChange={onDateChange}
                current={date ? getFormatedDate(moment(date, 'MM/DD/YYYY'), 'YYYY/MM/DD') : current}
                selected={getFormatedDate(moment(date, 'MM/DD/YYYY'))}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
            />
            <TouchableOpacity disabled={date === ''} onPress={clearDate}>
                <Text style={{ color: date === '' ? '#9d9d9d' : 'red', fontSize: 16 }}>clear</Text>
            </TouchableOpacity>
        </RBSheet>
    );
};

DatePickerDialog.defaultProps = {
    current: moment(moment().subtract(35, 'years')).format('YYYY-MM-DD'),
    maximumDate: moment().format('YYYY-MM-DD'),
    minimumDate: moment(moment().subtract(80, 'years')).format('YYYY-MM-DD'),
};

DatePickerDialog.propTypes = {
    forwardRef: PropTypes.object.isRequired,
    date: PropTypes.string,
    current: PropTypes.string.isRequired,
    title: PropTypes.string,
    onDateChange: PropTypes.func.isRequired,
    clearDate: PropTypes.func.isRequired,
};

export default DatePickerDialog;

const styles = StyleSheet.create({
    warningMessage: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 18,
        textAlign: 'center',
        paddingVertical: 15,
        paddingHorizontal: 40,
    },
});
