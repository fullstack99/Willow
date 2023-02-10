import React, { useRef, useState } from 'react';
import { StyleSheet, Dimensions, View, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { colors, fonts, emoji } from '../../constants';
import GlobalStyles from '../../constants/globalStyles';
import { connect } from 'react-redux';
import LoadingDotsOverlay from '../../components/LoadingDotsOverlay';
import Toast from '../../components/Toast';
import SearchBar from '../../components/Search/SearchBar';
import People from '../../components/Search/People';
import Tips from '../../components/Search/Tips';
import Questions from '../../components/Search/Questions';
const { height, width } = Dimensions.get('window');

const Search = ({ navigation }) => {
    const [selected, setSelected] = useState('people');
    const [search, setSearch] = useState('');
    const [search_trigger, setSearchTrigger] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();

    const onSearchSubmit = () => {
        setSearchTrigger(!search_trigger);
    };

    const onSelected = (selected) => {
        setSelected(selected);
        setSearch('');
        inputRef.current && inputRef.current.focus();
    };

    return (
        <TouchableWithoutFeedback style={GlobalStyles.container} onPress={Keyboard.dismiss}>
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <LoadingDotsOverlay animation={loading} />

                <SearchBar
                    navigation={navigation}
                    inputRef={inputRef}
                    selected={selected}
                    search={search}
                    onSelected={onSelected}
                    onSearch={setSearch}
                    onSearchSubmit={onSearchSubmit}
                />

                <People
                    navigation={navigation}
                    visible={selected === 'people'}
                    setSearch={setSearch}
                    searchTerm={search}
                    searchTrigger={search_trigger}
                    setError={setError}
                    loading={loading}
                    setLoading={setLoading}
                />

                <Tips
                    navigation={navigation}
                    visible={selected === 'tips'}
                    setSearch={setSearch}
                    searchTerm={search}
                    searchTrigger={search_trigger}
                    setError={setError}
                    loading={loading}
                    setLoading={setLoading}
                />

                <Questions
                    navigation={navigation}
                    visible={selected === 'questions'}
                    setSearch={setSearch}
                    searchTerm={search}
                    searchTrigger={search_trigger}
                    setError={setError}
                    loading={loading}
                    setLoading={setLoading}
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Search);

const styles = StyleSheet.create({});
