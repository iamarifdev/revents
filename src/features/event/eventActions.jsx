import { toastr } from 'react-redux-toastr';
import { DELETE_EVENT, FETCH_EVENT } from './eventConstants';
import { asyncActionStarted, asyncActionFinished, asyncActionError } from '../async/asyncActions';
import { fetchSampleData } from '../../app/data/mockApi';
import { createNewEvent } from '../../app/common/util/helpers';
import moment from 'moment'

export const fetchEvents = (events) => {
  return {
    type: FETCH_EVENT,
    payload: events
  };
};

export const createEvent = (event) => {
  return async (dispatch, getState, {getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    let newEvent = createNewEvent(user, photoURL, event);
    try {
      let createdEvent = await firestore.add('events', newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true
      });
      toastr.success('Success!', 'Event has been created');
    } catch (error) {
      toastr.error('Oops!', 'Something went wrong');
    }
  };
};

export const updateEvent = (event) => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    if(event.datae !==  getState().firestore.ordered.events[0].date) {
      event.date = moment(event.date).toDate();
    }
    try {
      await firestore.update(`events/${event.id}`, event);
      toastr.success('Success!', 'Event has been updated');
    } catch (error) {
      toastr.error('Oops!', 'Something went wrong');
    }
  };
};

export const cancelToggle = (cancelled, eventId) => 
  async (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    try {
      const message = cancelled 
        ? 'Are you sure you want to cancel the event?' 
        : 'This will reactivate the event - are you sure?';
      toastr.confirm(message, {
        onOk: () => 
          firestore.update(`events/${eventId}`, {
            cancelled: cancelled
          })
      })
    } catch (error) {
      console.log(error);      
    }
  };
  
export const deleteEvent = (eventId) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: DELETE_EVENT,
        payload: { eventId }
      });
      toastr.success('Success!', 'Event has been removed');
    } catch (error) {
      toastr.error('Oops!', 'Something went wrong');
    }
  };
};

export const loadEvents = () => {
  return async (dispatch) => {
    try {
      dispatch(asyncActionStarted());
      let events = await fetchSampleData();
      dispatch(fetchEvents(events));
      dispatch(asyncActionFinished());
    } catch(error) {
      console.log(error);      
      dispatch(asyncActionError());
    }
  };
};