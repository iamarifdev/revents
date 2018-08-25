import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import EventDetaildedInfo from './EventDetaildedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedSidebar from './EventDetailedSidebar';

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {};

  if(eventId && state.events.length > 0) {
    event = state.events.filter((event) => event.id === eventId)[0]
  }

  return {
    event
  };
};

const EventDetailedPage = ({event}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader event={event} />
        <EventDetaildedInfo event={event} />
        <EventDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar attendees={event.attendees}/>
      </Grid.Column>
    </Grid>
  )
}

export default connect(mapState)(EventDetailedPage);
