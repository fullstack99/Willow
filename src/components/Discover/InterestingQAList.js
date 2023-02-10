import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { colors, fonts, emoji } from '../../constants';
import { INTERESTING_QA_LIST } from '../../navigator/constants';
import { fetchInterestingQA } from '../../actions/interestingQuestionsActions';
import ListHeader from './ListHeader';
import InterestingQA from '../InterestingQA';
import DiscoverSkeleton from '../../components/Discover/DiscoverSkeleton';

const InterestingQAList = ({ navigation, fetchInterestingQA, interestingQA, loading }) => {
    useEffect(() => {
        fetchInterestingQA();
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
                    title={`interesting q&a ${emoji.messages}`}
                    onPress={() => navigation && navigation.push(INTERESTING_QA_LIST)}
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
                <ListHeader
                    title={`interesting q&a ${emoji.messages}`}
                    onPress={() => navigation && navigation.push(INTERESTING_QA_LIST)}
                />

                <FlatList
                    horizontal={true}
                    keyExtractor={(item, index) => item.id?.toString() || index}
                    data={interestingQA}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ marginVertical: 20 }}
                    renderItem={({ item }) => {
                        return <InterestingQA data={item} navigation={navigation} />;
                    }}
                />
            </View>
        );
    }
};

const mapStateToProps = (state) => ({
    interestingQA: state.interestingQA.data,
    loading: state.interestingQA.loading,
});

const mapDispatchToProps = {
    fetchInterestingQA,
};

export default connect(mapStateToProps, mapDispatchToProps)(InterestingQAList);

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
});
