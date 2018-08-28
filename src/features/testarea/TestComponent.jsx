import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import Script from 'react-load-script';
import { incrementAsync, decrementAsync } from './testActions';
import { openModal } from '../modals/modalActions';

const mapState = (state) => ({
  data: state.test.data,
  loading: state.test.loading
});

const actions = {
  incrementAsync,
  decrementAsync,
  openModal
};

class TestComponent extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  state = {
    address: '',
    scriptLoaded: false
  };
  
  handleScriptLoad = () => {
    this.setState({ scriptLoaded: true });
  };

  handleChange = (address) => this.setState({ address });

  render() {
    const { incrementAsync, decrementAsync, data, openModal, loading } = this.props;
    return (
      <div>
       <Script 
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyDoEWaXWmKOh0cleTsxVX_pYmSx7Ikqq_o&libraries=places"
          onLoad={this.handleScriptLoad}
        />
        <h1>{data}</h1>
        <Button loading={loading} onClick={incrementAsync} color='green' content="Increment" />
        <Button loading={loading} onClick={decrementAsync} color='red' content="Decrement" />
        <Button onClick={() => openModal('TestModal', {data: 43})} color='teal' content="Open Modal" />
        <br/> <br/>
      </div>
    );
  };
}

export default connect(mapState, actions)(TestComponent);