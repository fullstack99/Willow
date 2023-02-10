import * as Code from './constants';

const errors = [
    { code: Code.UNREGISTERED_PHONE_NUMBER, message: 'sorry, your mobile number is not registered on the app' },
    { code: Code.INVALID_PHONE_NUMBER, message: 'sorry, the mobile number is invalid' },
    { code: Code.MISSING_PHONE_NUMBER, message: 'sorry, mobile number is missing' },
    { code: Code.TOO_MANY_REQUESTS, message: 'sorry, for security reasons you must try again later' },
    { code: Code.USER_DISABLED, message: 'sorry, this mobile number has been disabled. please contact info@willow.app' },
    { code: Code.UNAVAILABLE_PHONE_NUMBER, message: 'sorry, this mobile number is already registered' },
    { code: Code.UNAVAILABLE_USERNAME, message: 'sorry, this username is already registered' },
    { code: Code.INVALID_VERIFICATION_CODE, message: 'sorry, the verification code is incorrect' },
    { code: Code.INVALID_EMAIL, message: 'sorry, the email address is invalid' },
    { code: Code.MISSING_FILENAME, message: 'server error' },
    { code: Code.INVALID_USERNAME, message: 'only lowercase letters, numbers and/or underscores are allowed' },
    { code: Code.NOT_AUTHENTICATED, message: 'user is not authenticated' },
    { code: Code.INVALID_ARGUMENTS, message: 'invalid or missing arguments' },
    { code: Code.DATABASE_ERROR, message: 'database error. please try again' },
    { code: Code.NOT_FOUND, message: 'does not exist' },
    { code: Code.SERVER_ERROR, message: 'server error. please try again' },
];

class FirebaseErrors {
    checkError = (error) => {
        if (typeof error === 'object' && error.code && typeof error.code === 'string') {
            return errors.filter((e) => e.code === error.code)[0]?.message || 'unknown error';
        } else {
            return typeof error === 'string' ? error : 'unknown error';
        }
    };

    setError = (error, setError) => {
        console.log(error);
        const message = this.checkError(error);
        if (setError) {
            setError(message);
            setTimeout(() => setError(''), 4000);
        } else {
            return message;
        }
    };
}

export * from './constants';
export default new FirebaseErrors();
