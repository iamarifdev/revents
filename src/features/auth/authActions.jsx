import { SubmissionError } from 'redux-form';
import { closeModal } from '../modals/modalActions';

// import firebase, { firestore } from 'firebase';

export const login = (creds) => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    try{
      await firebase.auth().signInWithEmailAndPassword(creds.email, creds.password);
      dispatch(closeModal());
    } catch(error) {
      console.log(error);
      throw new SubmissionError({
        _error: 'Login Failed'
      });
    }
  };
};

export const registerUser = (user) => 
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    
    try {
      const firebase = getFirebase();
      const firestore = getFirestore();

      let credential = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
      let currentUser = await firebase.auth().currentUser;
      console.log(credential);

      await currentUser.updateProfile({
        displayName: user.displayName
      });
      let newUser = {
        displayName: user.displayName,
        createdAt: firestore.FieldValue.serverTimestamp()
      };
      await firestore.set(`users/${currentUser.uid}`, {...newUser});
      dispatch(closeModal());
    } catch(error) {
      console.log(error);
      throw new SubmissionError({
        _error: error.message
      });
    }
  };


  export const socialLogin = (selectedProvider) =>
    async (dispatch, getState, { getFirebase, getFirestore }) => {      
      const firebase = getFirebase();
      const firestore = getFirestore();
      try {
        dispatch(closeModal());
        let user = await firebase.login({
          provider: selectedProvider,
          type: 'popup'
        });
        if (user.additionalUserInfo.isNewUser) {
          await firestore.set(`/users/${user.user.uid}`, {
            displayName: user.profile.displayName,
            photoURL: user.profile.avatarUrl,
            createdAt: firestore.FieldValue.serverTimestamp()
          });
        }
      } catch(error) {
        console.log(error);        
      }
    };