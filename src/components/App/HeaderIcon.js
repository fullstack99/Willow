import React from 'react';
import { TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../../constants/globalStyles';

const HeaderIcon = ({ onPress, name, style, children, size }) => {
    if (!onPress) return null;
    else if (children) {
        return (
            <TouchableOpacity style={[GlobalStyles.headerIconContainer, style]} onPress={onPress}>
                {children}
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableOpacity style={[GlobalStyles.headerIconContainer, style]} onPress={onPress}>
                <FontAwesome size={size} name={name} />
            </TouchableOpacity>
        );
    }
};

HeaderIcon.defaultProps = {
    name: 'angle-left',
    size: 30,
};

HeaderIcon.propTypes = {
    onPress: PropTypes.func,
    name: PropTypes.string,
    size: PropTypes.number.isRequired,
    style: ViewPropTypes.style,
    children: PropTypes.element,
};

export default HeaderIcon;
