import React from 'react';
import { Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const DiscoverSkeleton = () => {
    const { width } = Dimensions.get('window');
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item marginVertical={20}>
                <SkeletonPlaceholder.Item
                    width={width * 0.43}
                    height={250}
                    marginRight={10}
                    marginBottom={10}
                    borderRadius={20}
                />
                <SkeletonPlaceholder.Item width={width * 0.38} height={20} marginRight={10} marginBottom={5} borderRadius={5} />
                <SkeletonPlaceholder.Item width={width * 0.36} height={20} marginRight={10} borderRadius={5} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
};

export default DiscoverSkeleton;
