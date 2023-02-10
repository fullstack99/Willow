import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import * as ERROR_CONSTANTS from '../../service/firebase_errors/constants';

const FEED_REF = firestore().collection(DATABASE_CONSTANTS.FEED);
const USER_REF = firestore().collection(DATABASE_CONSTANTS.USER);
class Product {
    searchProductsByName = (search_term, page) => {
        return new Promise((resolve, reject) => {
            axios
                .get(`/api/products/search?search_term=${search_term}&page=${page}`)
                .then(resolve)
                .catch((err) => {
                    reject(err);
                    return;
                });
        });
    };
    getProductByASIN = (asin) => {
        return new Promise((resolve, reject) => {
            axios
                .get(`/api/products/`, { params: { asin } })
                .then((res) => resolve(res.data?.product || null))
                .catch((err) => {
                    reject(err);
                    return;
                });
        });
    };
    getMyProducts = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }
            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.ITEMS)
                .get()
                .then((querySnapshot) => {
                    resolve(
                        querySnapshot.docs.map((doc) => {
                            return { id: doc.id, ...doc.data() };
                        }),
                    );
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                    return;
                });
        });
    };
    getUserPorductsByUserID = (userID) => {
        return new Promise((resolve, reject) => {
            if (!userID || typeof userID !== 'string') {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }
            USER_REF.doc(userID)
                .collection(DATABASE_CONSTANTS.ITEMS)
                .get()
                .then((querySnapshot) => {
                    resolve(
                        querySnapshot.docs.map((doc) => {
                            return { id: doc.id, ...doc.data() };
                        }),
                    );
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                    return;
                });
        });
    };
    getTipsByProductASIN = (asin) => {
        return new Promise((resolve, reject) => {
            FEED_REF.where('type', '==', DATABASE_CONSTANTS.TIPS)
                .where('product.asin', '==', asin)
                .orderBy('vote', 'desc')
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map((tip) => {
                        return { id: tip.id, ...tip.data() };
                    });
                    resolve(data);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };
    getQuestionsByProductASIN = (asin) => {
        return new Promise((resolve, reject) => {
            FEED_REF.where('type', '==', DATABASE_CONSTANTS.QUESTIONS)
                .where('product.asin', '==', asin)
                .orderBy('vote', 'desc')
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map((tip) => {
                        return { id: tip.id, ...tip.data() };
                    });
                    resolve(data);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };
    getReviewsByProductASIN = (asin) => {
        return new Promise((resolve, reject) => {
            FEED_REF.where('type', '==', DATABASE_CONSTANTS.REVIEWS)
                .where('product.asin', '==', asin)
                .orderBy('vote', 'desc')
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map((tip) => {
                        return { id: tip.id, ...tip.data() };
                    });
                    resolve(data);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };
}

export default new Product();
