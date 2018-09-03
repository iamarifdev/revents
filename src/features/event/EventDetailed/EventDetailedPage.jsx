import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import { Grid } from 'semantic-ui-react';
import EventDetaildedInfo from './EventDetaildedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedSidebar from './EventDetailedSidebar';
import { objectToArray } from '../../../app/common/util/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';

const mapState = (state, ownProps) => {
  let event = {};
  const { match } = ownProps;

  if (match.params && match.params.id) {
    const { events } = state.firestore.ordered;
    event = (events && events.find((item) => item.id === match.params.id)) || event;
  }

  return {
    event,
    auth: state.firebase.auth
  };
};

const actions = {
  goingToEvent,
  cancelGoingToEvent
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
    const { event, auth, goingToEvent, cancelGoingToEvent } = this.props;
    const attendees = event && event.attendees && objectToArray(event.attendees);
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader 
            event={event}
            isHost={isHost}
            isGoing={isGoing}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
          />
          <EventDetaildedInfo event={event} />
          <EventDetailedChat />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar attendees={attendees}/>
        </Grid.Column>
      </Grid>
    );
  };
}

export default withFirestore(connect(mapState, actions)(EventDetailedPage));
