import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const MessageTimestampSkeleton = () => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={50} height={10} marginTop={5} />
        </SkeletonPlaceholder>
    );
};

export default MessageTimestampSkeleton;
