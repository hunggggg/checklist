import React from 'react';
import { SectionList, Text, View, } from 'react-native';
import Task from './Task';
import styles from './styles';

export default class TaskList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const sections = [{
      title: this.props.title,
      data: this.props.taskList,
    }];

    return (
      <View>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item + index}
          renderItem={obj => <Task {...(obj.item)} />}
          renderSectionHeader={obj => <Text style={styles.listTitle}>{obj.section.title}</Text>} 
        />
      </View>
    );
  }
};
