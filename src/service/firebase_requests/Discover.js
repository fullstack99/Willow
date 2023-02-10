import firestore from '@react-native-firebase/firestore';
import * as constants from '../database_constants';

const HOT_ITEMS_REF = firestore().collection(constants.HOT_ITEMS);

class Discover {
    fetchHotItems = () => {
        return new Promise((resolve, reject) => {
            HOT_ITEMS_REF.get()
                .then((querySnapshot) => {
                    const data = [];
                    if (querySnapshot.empty) resolve(data);
                    querySnapshot.forEach((documentSnapshot) => {
                        data.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
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

export default new Discover();
