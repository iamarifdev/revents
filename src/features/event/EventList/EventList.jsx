import React, { Component } from 'react';
import EventListItem from './EventListItem';
import InifiniteScroll from 'react-infinite-scroller';

class EventList extends Component {
  render() {
    const { events, getNextEvents, loading, moreEvents } = this.props;
    return (
      <div>
        {
          events && events.length !== 0 &&
          <InifiniteScroll 
            pageStart={0} 
            loadMore={getNextEvents} 
            hasMore={!loading && moreEvents} 
            initialLoad={false}
          >
          {
            events && events.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))
          }
          </InifiniteScroll>
        }        
      </div>
    )
  }
}

export default EventList;
