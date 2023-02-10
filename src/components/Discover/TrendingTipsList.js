import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { colors, fonts, emoji } from '../../constants';
import { TRENDING_TIPS_LIST } from '../../navigator/constants';
import { fetchTrendingTips, resetTrendingTips } from '../../actions/trendingTipsActions';
import ListHeader from './ListHeader';
import TrendingTip from '../TrendingTip';
import DiscoverSkeleton from '../../components/Discover/DiscoverSkeleton';

const TrendingTipsList = ({ navigation, trendingTips, loading, fetchTrendingTips }) => {
    useEffect(() => {
        fetchTrendingTips();
    }, []);

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
                <ListHeader
                    title={`trending tips ${emoji.thunder}`}
                    onPress={() => this.props.navigation.navigate(TRENDING_TIPS_LIST)}
                />

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
                <ListHeader title={`trending tips ${emoji.thunder}`} onPress={() => navigation.navigate(TRENDING_TIPS_LIST)} />

                <FlatList
                    horizontal={true}
                    keyExtractor={(item, index) => item.id?.toString() || index}
                    data={trendingTips}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <TrendingTip data={item} navigation={navigation} />;
                    }}
                />
            </View>
        );
    }
};

const mapStateToProps = (state) => ({
    trendingTips: state.trendingTips.data,
    loading: state.trendingTips.loading,
});

const mapDispatchToProps = {
    fetchTrendingTips,
    resetTrendingTips,
};

export default connect(mapStateToProps, mapDispatchToProps)(TrendingTipsList);

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
});
