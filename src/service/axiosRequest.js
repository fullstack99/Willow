import auth from '@react-native-firebase/auth';
import axios from 'axios';

class axiosRequest {
    configure = (resetUser) => {
        return new Promise((resolve, reject) => {
            auth()
                .currentUser.getIdToken()
                .then((token) => {
                    if (token) {
                        console.log('[ID Token]:', token);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        // console.log(axios.defaults);
                    }
                    resolve();
                })
                .catch((err) => {
                    switch (err.code) {
                        case 'auth/user-not-found':
                            auth()
                                .signOut()
                                .finally(() => {
                                    resetUser && resetUser();
                                    resolve();
                                });
                        default:
                            console.log('[axiosRequest] error in configure:', err);
                            reject(err);
                            return;
                    }
                });
        });
    };
}

export default new axiosRequest();
