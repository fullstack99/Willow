import { EThree } from '@virgilsecurity/e3kit-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import jwt_decode from 'jwt-decode';

class EThreeService {
    async init() {
        try {
            this.eThree = await EThree.initialize(this.getToken().bind(this), { AsyncStorage });
        } catch (err) {
            console.error('e3kit init error', err);
        }
    }

    getToken() {
        return () =>
            axios.post('/api/chat/auth').then((response) => {
                const expiredTime = jwt_decode(response.data.virgil_jwt).exp;
                AsyncStorage.setItem('expiredTime', expiredTime.toString());
                return response.data.virgil_jwt;
            });
    }

    getEThreeInstance() {
        return this.eThree;
    }

    regsiter() {
        return this.eThree.register();
    }

    async restore() {
        const { loginPassword, backupPassword } = EThree.derivePasswords('password');
        const hasLocalPrivateKey = await this.eThree.hasLocalPrivateKey();

        if (!hasLocalPrivateKey) return this.eThree.restorePrivateKey(loginPassword.data);
    }

    async cleanup() {
        await this.eThree.cleanup();
    }

    backupPrivateKey() {
        return this.eThree.backupPrivateKey();
    }

    async resetPrivateKeyBackup() {
        await this.eThree.resetPrivateKeyBackup();
    }

    async refreshToken() {
        const jwtExpiredTime = await AsyncStorage.getItem('expiredTime');
        const today = new Date();
        if (parseInt(jwtExpiredTime) - today / 1000 < 0) {
            console.log('get refresh token');
            await this.init();
        }
    }
}

export default new EThreeService();
