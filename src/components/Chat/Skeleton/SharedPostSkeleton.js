import React from 'react';
import { Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SharedPostSkeleton = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
                width={Dimensions.get('window').width * 0.5}
                height={250}
                marginRight={10}
                marginBottom={10}
                borderRadius={20}
            />
        </SkeletonPlaceholder>
    );
};

export default SharedPostSkeleton;
