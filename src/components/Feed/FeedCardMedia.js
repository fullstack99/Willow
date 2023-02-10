import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import DoubleTap from 'react-native-double-tap';
import FastImage from 'react-native-fast-image';
import FeedCardActionBar from './FeedCardActionBar';

const FeedCardMedia = ({ data, navigation, singleTap, doubleTap, openAuthDialog, addMilkBottle, showReviewSection }) => {
    const hasImage = data.image_url
        ? typeof data.image_url === 'string' || (Array.isArray(data.image_url) && data.image_url.length > 0)
        : false;
    if (hasImage) {
        return (
            <View>
                <DoubleTap singleTap={singleTap} doubleTap={doubleTap}>
                    {data.image_url && (
                        <FastImage
                            source={{
                                uri: typeof data.image_url === 'string' ? data.image_url : data.image_url[0],
                                cache: 'web',
                            }}
                            style={
                                showReviewSection && data.product
                                    ? {
                                          height: 300,
                                          borderTopLeftRadius: 25,
                                          borderTopRightRadius: 25,
                                      }
                                    : {
                                          height: 300,
                                          borderRadius: 25,
                                      }
                            }
                        />
                    )}
                </DoubleTap>
                <FeedCardActionBar
                    navigation={navigation}
                    data={data}
                    openAuthDialog={openAuthDialog}
                    addMilkBottle={addMilkBottle}
                    hasImage={hasImage}
                />
            </View>
        );
    } else {
        return (
            <FeedCardActionBar
                navigation={navigation}
                data={data}
                openAuthDialog={openAuthDialog}
                addMilkBottle={addMilkBottle}
                hasImage={hasImage}
            />
        );
    }
};

FeedCardMedia.propTypes = {
    data: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    singleTap: PropTypes.func.isRequired,
    doubleTap: PropTypes.func.isRequired,
    openAuthDialog: PropTypes.func.isRequired,
    addMilkBottle: PropTypes.func,
    showReviewSection: PropTypes.bool.isRequired,
};

export default FeedCardMedia;
