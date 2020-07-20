/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { YellowBox } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NetInfo from '@react-native-community/netinfo';

import TodoApp from './src/index';

import { fetchData, setConnectionStatus } from './src/redux/actions/UserDataActions';
import { fetchCustomData } from './src/redux/actions/CustomizeActions';
import { updateUserData } from './src/api';


YellowBox.ignoreWarnings(["Setting a timer"]);

class App extends React.Component {
  componentDidMount = async () => {
    await this.props.fetchCustomData();
    await this.props.fetchData();
    NetInfo.addEventListener(state => {
      this.props.setConnectionStatus(state.isConnected);
      let uid = this.props.appData.data.uid;
      let data = { ...this.props.appData.data };
      delete data.uid;
      if (state.isConnected && uid !== "Guest") {
        updateUserData(uid, data);
      }
    });
  }
  
  render() {
    return <TodoApp />;
  }
};

const mapStateToProps = state => ({
  appData: state.userData,
  customize: state.customize,
});

const mapDispatchToProps = dispatch => ({
  fetchCustomData: () => dispatch(fetchCustomData()),
  fetchData: () => dispatch(fetchData()),
  setConnectionStatus: bindActionCreators(setConnectionStatus, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
