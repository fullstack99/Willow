import { EThree } from '@virgilsecurity/e3kit-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import User from '../firebase_requests/User';

class EThreeService {
    initialize = () => {
        return new Promise((resolve, reject) => {
            EThree.initialize(this.tokenCallback, { AsyncStorage })
                .then((eThree) => {
                    this.eThree = eThree;
                    // console.log(this.eThree);
                    resolve(eThree);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };

    tokenCallback = () => {
        return new Promise((resolve, reject) => {
            axios
                .post('/api/chat/auth')
                .then((response) => {
                    const expiredTime = jwt_decode(response.data.virgil_jwt).exp;
                    AsyncStorage.setItem('expiredTime', expiredTime.toString());
                    resolve(response.data.virgil_jwt);
                    return;
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };

    getEthree = () => {
        if (this.eThree) {
            // console.log(this.eThree);
            return this.eThree;
        }
    };

    register = () => {
        return new Promise((resolve, reject) => {
            if (this.eThree && this.eThree.register) {
                this.eThree
                    .register()
                    .then(() => {
                        console.log('Registerd!');
                        resolve();
                    })
                    .catch((error) => {
                        console.log(error);
                        if (error.name === 'IdentityAlreadyExistsError') {
                            this.eThree.cleanup().then(() => {
                                console.log('cleaned up!');
                                this.eThree.rotatePrivateKey().then(() => {
                                    console.log('success!');
                                    this.eThree.register().then(() => {
                                        console.log('register successfully!');
                                        resolve();
                                    });
                                });
                            });
                        }
                    });
            } else {
                reject('Missing eThree service');
                return;
            }
        });
    };

    unregister = () => {
        return new Promise((resolve, reject) => {
            if (this.eThree && this.eThree.unregister) {
                this.eThree
                    .unregister()
                    .then(() => {
                        console.log('unregister successfully!');
                        resolve();
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                        return;
                    });
            }
        });
    };

    cleanup = () => {
        return new Promise((resolve, reject) => {
            if (this.eThree && this.eThree.cleanup) {
                this.eThree
                    .cleanup()
                    .then(() => {
                        console.log('cleanup successfully!');
                        resolve();
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                        return;
                    });
            }
        });
    };

    rotatePrivateKey = () => {
        return new Promise((resolve, reject) => {
            if (this.eThree && this.eThree.rotatePrivateKey) {
                this.eThree
                    .rotatePrivateKey()
                    .then(() => {
                        console.log('rotate key instead');
                        resolve();
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                        return;
                    });
            }
        });
    };

    findUsers = (userID) => {
        return new Promise((resolve, reject) => {
            if (this.eThree && this.eThree.findUsers) {
                this.eThree
                    .findUsers(userID)
                    .then(resolve)
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                        return;
                    });
            } else {
                this.initialize()
                    .then(() => {
                        this.findUsers(userID)
                            .then(resolve)
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                                return;
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                        return;
                    });
            }
        });
    };

    getGroupEThree = (roomID, ownerID) => {
        return new Promise((resolve, reject) => {
            if (!roomID || !ownerID) {
                reject('invalid arguments');
                return;
            }

            if (this.eThree) {
                return this.eThree.getGroup(roomID).then(async (groupEThree) => {
                    if (groupEThree) {
                        resolve(groupEThree);
                    } else {
                        this.eThree
                            .findUsers(ownerID)
                            .then((ownerCard) => {
                                this.eThree
                                    .loadGroup(roomID, ownerCard)
                                    .then(resolve)
                                    .catch((error) => {
                                        reject(error);
                                        return;
                                    });
                            })
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    }
                });
            } else {
                this.initialize().then((eThree) => {
                    this.eThree.getGroup(roomID).then((groupEThree) => {
                        if (groupEThree) {
                            resolve(groupEThree);
                        } else {
                            this.eThree
                                .findUsers(ownerID)
                                .then((ownerCard) => {
                                    this.eThree
                                        .loadGroup(roomID, ownerCard)
                                        .then(resolve)
                                        .catch((error) => {
                                            reject(error);
                                            return;
                                        });
                                })
                                .catch((error) => {
                                    reject(error);
                                    return;
                                });
                        }
                    });
                });
            }
        });
    };

    getGroupMembersCard = (memberIDs) => {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(memberIDs)) {
                reject('invalid argument');
                return;
            }

            const getMemberCard = (id) => {
                return new Promise((resolve, reject) => {
                    if (!id) {
                        reject('missing id');
                        return;
                    }
                    if (this.eThree && this.eThree.findUsers) {
                        return this.eThree
                            .findUsers(id)
                            .then((userCard) => resolve({ id, userCard }))
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    } else {
                        this.initialize().then((eThree) => {
                            eThree
                                .findUsers(id)
                                .then((userCard) => resolve({ id, userCard }))
                                .catch((error) => {
                                    reject(error);
                                    return;
                                });
                        });
                    }
                });
            };
            return Promise.all(memberIDs.map((id) => getMemberCard(id)))
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    deleteGroup = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!roomID) {
                reject('invalid argument');
                return;
            }

            if (this.eThree) {
                this.eThree
                    .deleteGroup(roomID)
                    .then(resolve)
                    .catch((error) => {
                        reject(error);
                        return;
                    });
            } else {
                this.initialize().then((eThree) => {
                    this.eThree
                        .deleteGroup(roomID)
                        .then(resolve)
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                });
            }
        });
    };
}

export default new EThreeService();
