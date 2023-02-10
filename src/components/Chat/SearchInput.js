import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { colors, fonts } from '../../constants';
import GlobalStyles from '../../constants/globalStyles';

const SearchInput = ({ navigation, onSearchSubmit, search, setSearch }) => {
    return (
        <View style={GlobalStyles.searchBar}>
            <FontAwesome name="search" color={colors.PRIMARY_COLOR} size={25} style={{ marginHorizontal: 5 }} />
            <TextInput
                returnKeyType={'done'}
                style={GlobalStyles.search}
                onChangeText={setSearch}
                value={search}
                clearButtonMode="while-editing"
                placeholder={'search...'}
                placeholderTextColor="#999"
                autoCorrect={false}
                autoCapitalize="words"
            />
        </View>
    );
};

export default SearchInput;
