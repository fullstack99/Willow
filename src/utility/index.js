import { Alert } from 'react-native';
import moment from 'moment';

export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (typeof email !== 'string' || email.length === 0) return true;
    return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^\+1 ([0-9]{3})-([0-9]{3})-([0-9]{4})$/;
    if (typeof phoneNumber !== 'string' || phoneNumber.length === 0) return false;
    return phoneNumberRegex.test(phoneNumber);
};

export const validateUsername = (username) => {
    const usernameRegex = /^@[a-z0-9_]+$/;
    if (typeof username !== 'string' || username.length === 0) return false;
    else if (username === '@anonymous' || username === '@willow') return false;
    return usernameRegex.test(username);
};

export const discardAlert = (onPress, title, message, discardText, cancelText) => {
    if (typeof onPress !== 'function') return;
    if (!title) title = 'Discard changes?';
    if (!message) message = 'You have unsaved changes. Are you sure you want to discard them and leave the screen?';
    if (!discardText) discardText = 'Discard';
    if (!cancelText) cancelText = "Don't leave";
    return Alert.alert(title, message, [
        { text: cancelText, style: 'cancel' },
        {
            text: discardText,
            style: 'destructive',
            onPress,
        },
    ]);
};

export const actionAlert = (onPress, title, message, actionText) => {
    if (typeof onPress !== 'function' || !title || !message || !actionText) return;
    return Alert.alert(title, message, [
        { text: 'Cancel', style: 'cancel' },
        {
            text: actionText,
            onPress,
        },
    ]);
};

export const childrenListSort = (a, b) => {
    const a_age = moment(a.birthday, 'MM/DD/YYYY').isValid() ? moment().diff(moment(a.birthday, 'MM/DD/YYYY'), 'months') : null;
    const b_age = moment(b.birthday, 'MM/DD/YYYY').isValid() ? moment().diff(moment(b.birthday, 'MM/DD/YYYY'), 'months') : null;

    if (a_age === null && b_age !== null) return -1;
    else if (a_age !== null && b_age === null) return 1;
    else if (a_age > b_age) return 1;
    else if (a_age < b_age) return -1;
    else if (a.gender === null && b.gender !== null) return -1;
    else if (a.gender !== null && b.gender === null) return 1;
    else return 0;
};

export const checkIfMessageIsEmojisOnly = (message) => {
    const emoji_regex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
    return emoji_regex.test(message);
};

export const sortArrayByName = (array, name) => {
    if (!name) return array;
    if (!Array.isArray(array)) return [];
    const re = new RegExp(name + '.*$', 'i');
    return array.filter((e, i, a) => {
        return e.name?.search(re) != -1;
    });
};

export const getRandomInt = (min, max) => {
    const minimum = Math.ceil(min);
    const maximum = Math.floor(max);
    return Math.floor(Math.random() * (maximum - minimum)) + minimum;
};
