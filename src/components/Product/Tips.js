import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { fonts, colors } from '../../constants';
import EmptyState from './EmptyState';
import FeedCard from '../Feed/FeedCard';

const Tips = ({ navigation, data, product, show, setError, setLoading }) => {
    if (!show || !Array.isArray(data)) return null;
    else if (data.length === 0) return <EmptyState title={'no tips yet'} />;
    else {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>product's tips</Text>
                {data.map((tip) => (
                    <FeedCard
                        key={tip.id}
                        data={tip}
                        navigation={navigation}
                        setError={setError}
                        setLoading={setLoading}
                        showReviewSection={false}
                    />
                ))}
            </View>
        );
    }
};

Tips.propTypes = {
    navigation: PropTypes.object.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })),
    show: PropTypes.bool.isRequired,
    product: PropTypes.shape({ asin: PropTypes.string.isRequired }),
    setLoading: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
};

export default Tips;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
        marginVertical: 30,
    },
});
