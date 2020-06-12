import React from 'react';
import { View, } from 'react-native';
import Button from '../components/Button/index';
import colors from '../styles/colors';

export default class Settings extends React.Component {
  constructor (props) {
    super(props);
  }

  toggleDrawer = () => {
    this.props.navigation.toggleDrawer();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.Background }}>
        <Button.Menu onPress={this.toggleDrawer} />
      </View>
    );
  }
};