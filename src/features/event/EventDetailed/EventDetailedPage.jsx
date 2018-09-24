import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { Grid } from 'semantic-ui-react';
import { objectToArray, createDataTree } from '../../../app/common/util/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';
import EventDetaildedInfo from './EventDetaildedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedSidebar from './EventDetailedSidebar';
import { addEventComment } from '../eventActions';

const mapState = (state, ownProps) => {
  let event = {};
  const { match } = ownProps;

  if (match.params && match.params.id) {
    const { events } = state.firestore.ordered;
    event = (events && events.find((item) => item.id === match.params.id)) || event;
  }

  return {
    event,
    auth: state.firebase.auth,
    loading: state.async.loading,
    eventChat: 
      !isEmpty(state.firebase.data.event_chat) 
      && objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
  };
};

const actions = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment
};

class EventDetailedPage extends Component {

  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  render() {
    const { loading, event, auth, goingToEvent, cancelGoingToEvent, addEventComment, eventChat } = this.props;
    const attendees = event && event.attendees && objectToArray(event.attendees);
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader 
            event={event}
            loading={loading}
            isHost={isHost}
            isGoing={isGoing}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
          />
          <EventDetaildedInfo event={event} />
          <EventDetailedChat 
            eventChat={chatTree} 
            addEventComment={addEventComment} 
            eventId={event.id} 
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar attendees={attendees}/>
        </Grid.Column>
      </Grid>
    );
  };
}

export default compose(
  withFirestore,
  connect(mapState, actions),
  firebaseConnect((props) => ([`event_chat/${props.match.params.id}`]))
)(EventDetailedPage);
