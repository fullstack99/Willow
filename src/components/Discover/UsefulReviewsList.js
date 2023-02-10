import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsefulReviews } from '../../actions/usefulReviewsActions';
import { colors, fonts, emoji } from '../../constants';
import { USEFUL_REVIEWS_LIST } from '../../navigator/constants';
import ListHeader from './ListHeader';
import UsefulReviews from '../UsefulReviews';
import DiscoverSkeleton from './DiscoverSkeleton';

const UsefulReviewsList = ({ navigation }) => {
    const { loading, data } = useSelector((state) => state.usefulReviews);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUsefulReviews());
    }, [dispatch, fetchUsefulReviews]);

    const skeletonObject = [
        {
            key: '1',
            children: <DiscoverSkeleton />,
        },
        {
            key: '2',
            children: <DiscoverSkeleton />,
        },
        {
            key: '3',
            children: <DiscoverSkeleton />,
        },
    ];

    if (loading) {
        return (
            <View style={styles.container}>
                <ListHeader title={`useful reviews ${emoji.excited}`} onPress={() => navigation.navigate(USEFUL_REVIEWS_LIST)} />

                <FlatList
                    horizontal={true}
                    keyExtractor={(item, index) => item.key}
                    data={skeletonObject}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => item.children}
                />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <ListHeader title={`useful reviews ${emoji.thunder}`} onPress={() => navigation.navigate(USEFUL_REVIEWS_LIST)} />

                <FlatList
                    horizontal={true}
                    keyExtractor={(item, index) => item.id?.toString() || index}
                    data={data}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <UsefulReviews data={item} navigation={navigation} />;
                    }}
                />
            </View>
        );
    }
};

export default UsefulReviewsList;

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
});
