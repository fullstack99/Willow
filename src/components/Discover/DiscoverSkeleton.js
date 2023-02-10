import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const DiscoverSkeleton = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item marginVertical={20}>
                <SkeletonPlaceholder.Item width={200} height={250} marginRight={10} marginBottom={10} borderRadius={20} />
                <SkeletonPlaceholder.Item width={180} height={20} marginRight={10} marginBottom={5} borderRadius={5} />
                <SkeletonPlaceholder.Item width={100} height={20} marginRight={10} borderRadius={5} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    );
};

export default DiscoverSkeleton;
