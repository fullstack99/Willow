import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const REGISTER = 'register';
export const UPDATE_USERNAME = `${REGISTER}/UPDATE_USERNAME`;
export const UPDATE_FULLNAME = `${REGISTER}/UPDATE_FULLNAME`;
export const UPDATE_EMAIL = `${REGISTER}/UPDATE_EMAIL`;
export const UPDATE_COUNTRY = `${REGISTER}/UPDATE_COUNTRY`;
export const UPDATE_PHONE_NUMBER = `${REGISTER}/UPDATE_PHONE_NUMBER`;
export const UPDATE_AVATAR = `${REGISTER}/UPDATE_AVATAR`;
export const RESET_REGISTER = `${REGISTER}/RESET_REGISTER`;

export const updateUsername = (username) => ({
    type: UPDATE_USERNAME,
    username,
});

export const updateFullname = (fullName) => ({
    type: UPDATE_FULLNAME,
    fullName,
});

export const updateEmail = (email) => ({
    type: UPDATE_EMAIL,
    email,
});

export const updateCountry = (country) => ({
    type: UPDATE_COUNTRY,
    country,
});

export const updatePhoneNumber = (phoneNumber, mobileNumber) => ({
    type: UPDATE_PHONE_NUMBER,
    phoneNumber,
    mobileNumber,
});

export const updateAvatar = (avatar) => ({
    type: UPDATE_AVATAR,
    avatar,
});

export const resetRegister = () => ({
    type: RESET_REGISTER,
});
