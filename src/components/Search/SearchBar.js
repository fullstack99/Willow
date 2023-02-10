import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { colors, fonts } from '../../constants';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import PeopleWhiteIcon from '../../assets/Images/people-white.svg';
import PeopleIcon from '../../assets/Images/people-green.svg';
import TipWhiteIcon from '../../assets/Images/pen-white.svg';
import TipIcon from '../../assets/Images/pen-green.svg';
import ReviewWhiteIcon from '../../assets/Images/star-white.svg';
import ReviewIcon from '../../assets/Images/star-green.svg';
import QuestionWhiteIcon from '../../assets/Images/question-white.svg';
import QuestionIcon from '../../assets/Images/question-green.svg';
const { height, width } = Dimensions.get('window');

const SearchBar = ({ navigation, inputRef, selected, onSelected, search, onSearch, onSearchSubmit }) => {
    const slides = [
        {
            key: 'people',
            title: 'people',
            icon:
                selected === 'people' ? <PeopleWhiteIcon style={styles.filterIcon} /> : <PeopleIcon style={styles.filterIcon} />,
            text: 'Description.\nSay something cool',
            backgroundColor: '#59b2ab',
        },
        {
            key: 'tips',
            title: 'tips',
            icon: selected === 'tips' ? <TipWhiteIcon style={styles.filterIcon} /> : <TipIcon style={styles.filterIcon} />,
            text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
            backgroundColor: '#22bcb5',
        },
        {
            key: 'reviews',
            title: 'reviews',
            icon:
                selected === 'reviews' ? <ReviewWhiteIcon style={styles.filterIcon} /> : <ReviewIcon style={styles.filterIcon} />,
            text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
            backgroundColor: '#22bcb5',
        },
        {
            key: 'questions',
            title: 'questions',
            icon:
                selected === 'questions' ? (
                    <QuestionWhiteIcon style={styles.filterIcon} />
                ) : (
                    <QuestionIcon style={styles.filterIcon} />
                ),
            text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
            backgroundColor: '#22bcb5',
        },
    ];

    return (
        <View>
            <View style={styles.searchBarContainer}>
                <TouchableOpacity style={styles.searchBar}>
                    <FontAwesome name="search" color={colors.PRIMARY_COLOR} size={25} style={{ marginHorizontal: 5 }} />
                    <TextInput
                        ref={inputRef}
                        returnKeyType={'search'}
                        onBlur={onSearchSubmit}
                        blurOnSubmit
                        style={styles.search}
                        value={search}
                        onChangeText={onSearch}
                        clearButtonMode="while-editing"
                        placeholder={'search...'}
                        placeholderTextColor="#999"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelContainer} onPress={() => navigation.pop()}>
                    <Text style={styles.cancel}>cancel</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                keyExtractor={(item) => item.key}
                data={slides}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.filterBarRow}>
                            {item.key === selected ? (
                                <TouchableOpacity style={styles.selectedFilter} onPress={() => onSelected(item.key)}>
                                    {item.icon}
                                    <Text style={styles.selectedFilterText}>{item.title}</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.filter} onPress={() => onSelected(item.key)}>
                                    {item.icon}
                                    <Text style={styles.filterText}>{item.title}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                }}
            />
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    searchBarContainer: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginHorizontal: 10,
        marginTop: 10,
    },
    searchBar: {
        backgroundColor: colors.GREY,
        width: width * 0.8,
        height: height * 0.07,
        borderRadius: 30,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    search: {
        flex: 1,
        height: '100%',
        color: colors.BLACK,
        fontFamily: fonts.NEWYORKEXTRALARGE_SEMIBOLD,
        fontSize: 15,
        paddingLeft: 20,
    },
    cancelContainer: {
        justifyContent: 'center',
    },
    cancel: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
        color: colors.PRIMARY_COLOR,
    },
    filterBarContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    filterBarRow: {
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10,
    },
    selectedFilter: {
        backgroundColor: colors.PRIMARY_COLOR,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    selectedFilterText: {
        alignItems: 'center',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
        color: colors.WHITE,
    },
    filter: {
        backgroundColor: colors.GREY,
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    filterText: {
        alignItems: 'center',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
        color: colors.BLACK,
    },
    filterIcon: {
        marginRight: 10,
    },
});
