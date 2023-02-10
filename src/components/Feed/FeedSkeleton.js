import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const FeedSkeleton = () => {
    return (
        <View style={{ flex: 1, width: '100%' }}>
            <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item alignItems={'center'}>
                    <SkeletonPlaceholder.Item width={'80%'} height={500} margin={20} borderRadius={20}>
                        <SkeletonPlaceholder.Item flexDirection="row" alignItems={'center'} margin={20}>
                            <SkeletonPlaceholder.Item width={50} height={50} borderRadius={25} />
                            <SkeletonPlaceholder.Item marginLeft={20}>
                                <SkeletonPlaceholder.Item width={150} height={20} />
                                <SkeletonPlaceholder.Item width={80} height={10} marginTop={10} />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item marginHorizontal={20}>
                            <SkeletonPlaceholder.Item width={'100%'} height={20} marginVertical={5} />
                            <SkeletonPlaceholder.Item width={'100%'} height={20} marginVertical={5} />
                            <SkeletonPlaceholder.Item width={'70%'} height={20} marginVertical={5} />
                        </SkeletonPlaceholder.Item>

                        <SkeletonPlaceholder.Item position={'absolute'} top={70} width={'100%'} height={250} borderRadius={20} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>
    );
};

export default FeedSkeleton;
