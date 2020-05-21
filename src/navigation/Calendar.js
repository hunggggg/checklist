import React from 'react';
import { View, } from 'react-native';
import CalendarPicker from '../components/Calendar/index';
import Header from '../components/Header/index';
import Button from '../components/Button/index';
import colors from '../styles/colors';

export default class Calendar extends React.Component{  
  render(){
    return(
      <View style={{ flex: 1, backgroundColor: colors.Background }}>
        <Header title="CALENDAR" />
        <CalendarPicker />
        <Button.Menu onPress={() => this.props.navigation.toggleDrawer()} />
        <Button.Notice />
      </View>
    );
  }
};
