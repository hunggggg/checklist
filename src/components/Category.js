import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../styles/colors';


export default class Category extends React.Component {
  render() {
    let name = this.props.name;
    let size = this.props.size || 60;
    let icon;
    switch (name) {
      case "default":
        icon = <AntDesign name="switcher" color={colors.Default} size={0.625 * size} />;
        break;
      case "uncategorized":
        icon = <FontAwesome5 name="question" color={colors.Unknown} size={0.625 * size} />;
        break;
      case "health":
        icon = <FontAwesome name="heartbeat" color={colors.Health} size={0.625 * size} />;
        break;
      case "workout":
        icon = <MaterialCommunityIcons name="run-fast" color={colors.Workout} size={0.625*size} />;
        break;
      case "work":
        icon = <Entypo name="briefcase" color={colors.Work} size={0.625*size} />;
        break;
      case "study":
        icon = <Ionicons name="md-school" color={colors.Study} size={0.625*size} />;
        break;
      case "payment":
        icon = <FontAwesome5 name="money-bill-wave" color={colors.Payment} size={0.55*size} />;
        break;
      case "liveliness":
        icon = <MaterialCommunityIcons name="theater" color={colors.Liveliness} size={0.625*size} />;
        break;
      case "meeting":
        icon = <MaterialCommunityIcons name="account-group" color={colors.Meeting} size={0.625*size} />;
        break;
      case "ideas":
        icon = <MaterialCommunityIcons name="lightbulb-on-outline" color={colors.Ideas} size={0.625*size} />;
        break;
      case "event":
        icon = <Foundation name="calendar" color={colors.Event} size={0.625*size} />;
        break;
      default:
        icon = <FontAwesome5 name="question" color={colors.Unknown} size={0.625*size} />
        break;
    }
    return (
      <TouchableOpacity 
        style={[
          styles.categoryIcon,
          {
            backgroundColor: colors[name.charAt(0).toUpperCase() + name.slice(1)].replace('1.0', '0.1'),
            height: size,
            width: size,
            borderRadius: size / 2,
          }
        ]} 
        onPress={this.props.onPress} 
      >
        {icon}
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  categoryIcon: {
    alignItems: "center",
    justifyContent: "center", 
  },
});
