import React, { useState, useLayoutEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Keyboard,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import Search from '../../../assets/Images/Create/search.svg';
import Toast from '../../../components/Toast';
import ProductTab from '../../../components/Product/ProductTab';
import FirebaseErrors from '../../../service/firebase_errors';
import FirebaseProduct from '../../../service/firebase_requests/Product';

const SearchProduct = ({ navigation, route }) => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [nbPage, setNBPage] = useState(1);
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]);

    useLayoutEffect(() => {
        if (route.params.title) {
            navigation && navigation.setOptions({ title: route.params.title });
        }
    }, [navigation]);

    const _reset = () => {
        setPage(1);
        setNBPage(1);
        setError('');
        setProducts([]);
    };

    const onProducts = ({ data }) => {
        if (data) {
            setPage(page + 1);
            data?.search_results && Array.isArray(data.search_results) && setProducts(data.search_results);
            data?.pagination?.total_pages && setNBPage(data.pagination.total_pages);
        }
    };

    const onPaginateProducts = ({ data }) => {
        if (data) {
            setPage(page + 1);
            data?.search_results && Array.isArray(data.search_results) && setProducts([...products, ...data.search_results]);
            data?.pagination?.total_pages && setNBPage(data.pagination.total_pages);
        }
    };

    const onEndReached = () => {
        if (!loading && page < nbPage && search.length > 0) {
            setLoading(true);
            FirebaseProduct.searchProductsByName(search, page + 1)
                .then(onPaginateProducts)
                .catch((error) => {
                    console.log(error);
                    FirebaseErrors.setError(error, setError);
                })
                .finally(() => setLoading(false));
        }
    };

    const onSubmit = () => {
        if (!loading && search.length > 0) {
            setLoading(true);
            _reset();
            FirebaseProduct.searchProductsByName(search, 1)
                .then(onProducts)
                .catch((error) => {
                    console.log(error);
                    FirebaseErrors.setError(error, setError);
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <View style={styles.searchBarContainer}>
                <Search style={styles.searchIcon} width={23} height={23} />
                <TextInput
                    style={styles.input}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="search..."
                    clearButtonMode="while-editing"
                    onSubmitEditing={onSubmit}
                    returnKeyType="search"
                    autoCorrect={false}
                />
            </View>
            {loading && (
                <View style={{ paddingVertical: 15 }}>
                    <ActivityIndicator animating size="large" />
                </View>
            )}
            <FlatList
                data={products}
                keyExtractor={(item) => item.asin}
                renderItem={({ item }) => <ProductTab item={item} onSelectProduct={route.params.onSelectProduct} />}
                contentContainerStyle={{ paddingBottom: 80 }}
                onEndReachedThreshold={0.016}
                onEndReached={onEndReached}
            />
            <KeyboardSpacer />
        </SafeAreaView>
    );
};

export default SearchProduct;

const styles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: 'row',
        marginVertical: 20,
    },
    searchIcon: {
        position: 'absolute',
        left: 40,
        top: 12,
        zIndex: 999,
    },
    input: {
        flex: 1,
        paddingLeft: 55,
        paddingRight: 15,
        paddingVertical: 15,
        marginHorizontal: 20,
        borderRadius: 60,
        backgroundColor: colors.GREY,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
});
