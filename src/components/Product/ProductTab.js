import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import AddProductIcon from '../../assets/Images/add_product.svg';
import ProductInfo from './ProductInfo';
import { colors, fonts } from '../../constants';

const ProductTab = ({ item, onSelectProduct }) => {
    const renderRightIcon = () => {
        return (
            <TouchableOpacity style={styles.rightIconContainer} onPress={() => onSelectProduct(item)}>
                <AddProductIcon />
            </TouchableOpacity>
        );
    };

    return (
        <TouchableOpacity style={styles.container}>
            <FastImage source={{ uri: item?.image }} style={styles.productImage} resizeMode={FastImage.resizeMode.contain} />
            <ProductInfo title={item?.title} price={item?.price?.raw} rating={item?.rating} />
            {renderRightIcon()}
        </TouchableOpacity>
    );
};

ProductTab.propTypes = {
    item: PropTypes.shape({
        asin: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        title: PropTypes.string,
        price: PropTypes.shape({ raw: PropTypes.string, value: PropTypes.number }),
        rating: PropTypes.number,
    }).isRequired,
    onSelectProduct: PropTypes.func.isRequired,
};

export default ProductTab;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 15,
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 20,
        marginHorizontal: 20,
    },
    rightIconContainer: {
        paddingHorizontal: 20,
    },
});
