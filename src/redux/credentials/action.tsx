export const ADD_PHONE_NUMBER = 'ADD_PHONE_NUMBER';
export const ADD_VERIFICATION_ID = 'ADD_VERIFICATION_ID';

export const addPhoneNumber = (phoneNumber : string) => ({
    type: ADD_PHONE_NUMBER,
    payload:phoneNumber,
});

export const addVerificationId = (verificationId : string | null) => ({
    type: ADD_VERIFICATION_ID,
    payload:verificationId,
});