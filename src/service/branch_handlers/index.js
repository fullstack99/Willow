import branch from 'react-native-branch';
import auth from '@react-native-firebase/auth';
import FirebaseFeed from '../../service/firebase_requests/Feed';
import FirebaseUser from '../../service/firebase_requests/User';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';

class BranchHandlers {
    register = (navigateTo) => {
        this.deepLinkUnsubscribe = branch.subscribe(({ error, params, uri }) => {
            if (error) {
                console.log('Error from Branch: ' + error);
                return;
            }

            if (params['+non_branch_link']) {
                const nonBranchUrl = params['+non_branch_link'];
                // Route non-Branch URL if appropriate.
                return;
            }
            if (!params['+clicked_branch_link']) {
                // Indicates initialization success and some other conditions.
                // No link was opened.
                return;
            }

            console.log(params);

            if (params['data']) {
                const data = params['data'];

                switch (data.type) {
                    case 'share_item':
                        return navigateTo(auth().currentUser ? NAVIGATOR_CONSTANTS.FEED : NAVIGATOR_CONSTANTS.DISCOVER, {
                            screen: NAVIGATOR_CONSTANTS.PRODUCT,
                            initial: false,
                            params: {
                                available: true,
                                productID: data.product.asin,
                            },
                        });
                    case 'quick_friend':
                        FirebaseUser.quickFriendFollow(data.id);
                        return navigateTo(auth().currentUser ? NAVIGATOR_CONSTANTS.FEED : NAVIGATOR_CONSTANTS.DISCOVER, {
                            screen: NAVIGATOR_CONSTANTS.USER_PROFILE,
                            initial: false,
                            params: { available: true, userID: data.id },
                        });
                    case DATABASE_CONSTANTS.TIPS:
                        if (data.id) {
                            return FirebaseFeed.getFeedByID(data.id).then((feed) => {
                                navigateTo(auth().currentUser ? NAVIGATOR_CONSTANTS.FEED : NAVIGATOR_CONSTANTS.DISCOVER, {
                                    screen: NAVIGATOR_CONSTANTS.TIPS,
                                    initial: false,
                                    params: {
                                        tipID: data.id,
                                        available: feed ? true : false,
                                    },
                                });
                            });
                        } else break;
                    case DATABASE_CONSTANTS.REVIEWS:
                        if (data?.id) {
                            return FirebaseFeed.getFeedByID(data.id).then((feed) => {
                                navigateTo(auth().currentUser ? NAVIGATOR_CONSTANTS.FEED : NAVIGATOR_CONSTANTS.DISCOVER, {
                                    screen: NAVIGATOR_CONSTANTS.REVIEWS,
                                    initial: false,
                                    params: {
                                        reviewID: data.id,
                                        available: feed ? true : false,
                                    },
                                });
                            });
                        } else break;
                    case DATABASE_CONSTANTS.QUESTIONS:
                        if (data?.id) {
                            return FirebaseFeed.getFeedByID(data.id).then((feed) => {
                                navigateTo(auth().currentUser ? NAVIGATOR_CONSTANTS.FEED : NAVIGATOR_CONSTANTS.DISCOVER, {
                                    screen: NAVIGATOR_CONSTANTS.QUESTIONS,
                                    initial: false,
                                    params: {
                                        questionID: data.id,
                                        available: feed ? true : false,
                                    },
                                });
                            });
                        } else break;
                    default:
                        return;
                }
            }
        });
    };

    unRegister = () => {
        this.deepLinkUnsubscribe && this.deepLinkUnsubscribe();
    };
}

export default new BranchHandlers();
