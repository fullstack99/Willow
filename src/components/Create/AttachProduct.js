import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { colors, fonts } from '../../constants';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import ProductInfo from '../../components/Product/ProductInfo';
import ShoppingBag from '../../assets/Images/bag-white.svg';
import RemoveIcon from '../../assets/Images/Create/remove.svg';

const AttachProduct = ({ navigation, product, setProduct, title, required }) => {
    const navigateToSearchProduct = () => {
        navigation && navigation.push(NAVIGATOR_CONSTANTS.SEARCH_PRODUCT, { title: 'search Amazon', onSelectProduct });
    };

    const onSelectProduct = (product) => {
        setProduct && setProduct(product);
        navigation && navigation.goBack();
    };

    const removeProduct = () => {
        setProduct && setProduct(null);
    };

    if (product) {
        return (
            <React.Fragment>
                <TouchableOpacity style={styles.container} onPress={navigateToSearchProduct}>
                    <FastImage
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <ProductInfo title={product.title} price={product?.price?.raw} rating={product.rating} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeIcon} onPress={removeProduct}>
                    <RemoveIcon />
                </TouchableOpacity>
            </React.Fragment>
        );
    } else {
        return (
            <TouchableOpacity style={styles.container} onPress={navigateToSearchProduct}>
                <View style={styles.shoppingBagContainer}>
                    <ShoppingBag />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.placeholder}>
                        {title}
                        {!required && '?'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
};

AttachProduct.defaultProps = {
    required: false,
    title: `attach a product\nfrom Amazon`,
};

AttachProduct.propTypes = {
    navigation: PropTypes.object.isRequired,
    product: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ asin: PropTypes.string.isRequired })]),
    setProduct: PropTypes.func.isRequired,
    required: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
};

export default AttachProduct;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderWidth: 1,
        borderColor: colors.DARK_GREY,
        borderRadius: 25,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    shoppingBagContainer: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: colors.PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: 72,
        height: 72,
        borderRadius: 20,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
    },
    placeholder: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
    },
    removeIcon: {
        position: 'absolute',
        right: -5,
        bottom: -15,
    },
});
