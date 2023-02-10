import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { fonts, colors } from '../../constants';
import RatingBar from './RatingBar';
import ScoringBar from './ScoringBar';
import FeedCard from '../Feed/FeedCard';
import EmptyState from './EmptyState';

const Reviews = ({ navigation, data, product, show, setLoading, setError }) => {
    const [totalMarks, setTotalMarks] = useState(0);
    const [totalOneStars, setTotalOneStars] = useState(0);
    const [totalTwoStars, setTotalTwoStars] = useState(0);
    const [totalThreeStars, setTotalThreeStars] = useState(0);
    const [totalFourStars, setTotalFourStars] = useState(0);
    const [totalFiveStars, setTotalFiveStars] = useState(0);
    const [overallEOU, setOverallEOU] = useState(0);
    const [overallDesign, setOverallDesign] = useState(0);
    const [overallBQ, setOverallBQ] = useState(0);

    useEffect(() => {
        if (Array.isArray(data)) {
            setTotalMarks(data.reduce((acc, val) => (acc += val.overall), 0) / data.length || 0);
            setTotalOneStars(data.filter((r) => r.overall <= 1.5).length);
            setTotalTwoStars(data.filter((r) => r.overall > 1.5 && r.overall <= 2.5).length || 0);
            setTotalThreeStars(data.filter((r) => r.overall > 2.5 && r.overall <= 3.5).length || 0);
            setTotalFourStars(data.filter((r) => r.overall > 3.5 && r.overall <= 4.5).length || 0);
            setTotalFiveStars(data.filter((r) => r.overall > 4.5).length || 0);
            setOverallEOU(data.reduce((acc, val) => (acc += val.easy_of_use), 0) / data.length || 0);
            setOverallDesign(data.reduce((acc, val) => (acc += val.design), 0) / data.length || 0);
            setOverallBQ(data.reduce((acc, val) => (acc += val.build_quality), 0) / data.length || 0);
        }
    }, [data]);

    if (!show) return null;
    else if (Array.isArray(data) && data.length === 0) return <EmptyState title="no reviews yet" />;
    else {
        return (
            <View style={styles.container}>
                <View style={styles.totalRatingContainer}>
                    <View style={styles.overallRatingContainer}>
                        <Text style={styles.overallRating}>{totalMarks}</Text>
                        <Text style={styles.totalMarks}>{`${data.length} ${data.length === 1 ? 'review' : 'reviews'}`}</Text>
                    </View>

                    <View style={styles.starRatingsContainer}>
                        <RatingBar numberOfYellowStars={5} numberOfRatings={totalFiveStars} totalNumberOfRatings={data.length} />
                        <RatingBar numberOfYellowStars={4} numberOfRatings={totalFourStars} totalNumberOfRatings={data.length} />
                        <RatingBar numberOfYellowStars={3} numberOfRatings={totalThreeStars} totalNumberOfRatings={data.length} />
                        <RatingBar numberOfYellowStars={2} numberOfRatings={totalTwoStars} totalNumberOfRatings={data.length} />
                        <RatingBar numberOfYellowStars={1} numberOfRatings={totalOneStars} totalNumberOfRatings={data.length} />
                    </View>
                </View>

                <View>
                    <ScoringBar title={'easy of use'} score={overallEOU} />
                    <ScoringBar title={'design'} score={overallDesign} />
                    <ScoringBar title={'build quality'} score={overallBQ} />
                </View>

                <Text style={styles.productReviewsTitle}>product's reviews</Text>
                {data.map((review) => (
                    <FeedCard
                        key={review.id}
                        data={review}
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

Reviews.propTypes = {
    navigation: PropTypes.object.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })),
    show: PropTypes.bool.isRequired,
    product: PropTypes.shape({ asin: PropTypes.string.isRequired }),
    setLoading: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
};

export default Reviews;

const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
        marginHorizontal: 20,
    },
    totalRatingContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        alignItems: 'center',
    },
    overallRatingContainer: {
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overallRating: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 50,
    },
    totalMarks: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.DARKER_GREY,
    },
    starRatingsContainer: {
        flex: 1,
        marginRight: 10,
    },
    productReviewsTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
        marginVertical: 30,
    },
});
