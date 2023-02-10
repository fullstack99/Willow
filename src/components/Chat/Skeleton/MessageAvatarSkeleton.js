import React from 'react';
import PropTypes from 'prop-types';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const MessageAvatarSkeleton = ({ size, marginRight }) => {
    return (
        <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={size} height={size} marginRight={marginRight} borderRadius={size / 2} />
        </SkeletonPlaceholder>
    );
};

MessageAvatarSkeleton.defaultProps = {
    size: 35,
    marginRight: 15,
};

MessageAvatarSkeleton.propTypes = {
    size: PropTypes.number.isRequired,
    marginRight: PropTypes.number.isRequired,
};

export default MessageAvatarSkeleton;
