import React from 'react';
import { SectionList, StyleSheet, Text, View, DatePickerIOS, } from 'react-native';
import { Overlay } from 'react-native-elements';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Task from './Task';
import TaskForm from './Forms/TaskForm';
import { Create } from './Button';

import colors from '../styles/colors';

import { isToday, getWeekDates, getNameOfDay, extractDate } from '../utils/DateTime';

import { createTask, editTask, removeTask, editPinned } from '../redux/actions/UserDataActions';


export const FILTER_TODAY = "FILTER_TODAY";
export const FILTER_WEEK = "FILTER_WEEK";
export const FILTER_PINNED = "FILTER_PINNED";
export const FILTER_DATE = "FILTER_DATE";
export const FILTER_SEARCH = "FILTER_SEARCH";

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      selected: {},
    };
  }

  renderItem = ({ item }) => <Task {...item} onSelect={() => this.onSelectedTaskPress(item)} togglePinned={() => this.togglePinned(item)} />

  renderSectionHeader = ({ section }) => 
    <Text style={[styles.listTitle, {
      color: this.props.customize.darkTheme === false ? colors.LightTitleText : colors.DarkTitleText,
      fontFamily: this.props.customize.font,
      fontSize: this.props.customize.fontSize,
    }]}>{section.title}</Text>

  onAddButtonPress = () => {
    this.setState({ showForm: true });
  }

  onSelectedTaskPress = task => {
    this.setState({ showForm: true, selected: task });
  }

  onFormBackdropPress = () => {
    this.setState({ showForm: false, selected: {} });
  }

  togglePinned = selected => {
    this.props.editPinned(selected);
  }

  handleFormSubmit = task => {
    this.setState({ showForm: false });
    if (Object.keys(this.state.selected).length > 0) {
      this.props.editTask(task, this.state.selected);
    } else {
      this.props.createTask(task);
    }
    this.setState({ selected: {} });
  }

  handleRemoval = () => {
    this.props.removeTask(this.state.selected);
    this.setState({ showForm: false, selected: {} });
  }

  filterByToday = taskList => {
    return taskList.filter(task => isToday(task.dueTime)).reduce((obj, task) => {
      const title = "TODAY";
      return {
        ...obj,
        [title]: [...(obj[title] || []), task],
      };
    }, {});
  }

  filterByWeek = taskList => {
    let [start, end] = getWeekDates();

    return taskList.filter(task => task.dueTime <= end && task.dueTime >= start).reduce((obj, task) => {
      const title = getNameOfDay(task.dueTime);
      return {
        ...obj,
        [title]: [...(obj[title] || []), task],
      }
    }, {});
  }

  filterByPinned = taskList => {
    return taskList.filter(task => task.pinned).reduce((obj, task) => {
      const title = "IMPORTANT";
      return {
        ...obj,
        [title]: [...(obj[title] || []), task],  
      }
    }, {});
  }

  filterByDate = (taskList, date) => {
    return taskList.filter(task => extractDate(task.dueTime) === date).reduce((obj, task) => {
      const title = "";
      return {
        ...obj,
        [title]: [...(obj[title] || []), task],  
      }
    }, {});
  }
  filterSearch = (taskList, query, category, pinned, startInterval, endInterval) => {
    const filtedList = taskList.filter(item => {      
    const itemTitle = `${item.title.toUpperCase()}`;
    const itemCategory = `${item.category}`;
    const itemPinned = `${item.pinned}`;
    const itemDueTime = item.dueTime;
    const startIntervalChecker = startInterval === "" ? 1:itemDueTime >= startInterval;
    const endIntervalChecker = endInterval === "" ? 1:itemDueTime <= endInterval;
    const textData = query.toUpperCase();
    if (category === "default"){
      if (itemTitle.includes(textData) && startIntervalChecker && endIntervalChecker){
        return true;
      }   
    }
    if (itemTitle.includes(textData) && itemCategory === category && startIntervalChecker && endIntervalChecker){
      return true;
    }    
      return false;
    });
    
    return filtedList.reduce((obj, task) => {
      const title = "";
      return {
        ...obj,
        [title]: [...(obj[title] || []), task],
      };
    }, {});
  }

  filter = (option, taskList) => {
    switch(option) {
      case FILTER_TODAY:
        return this.filterByToday(taskList);
      case FILTER_WEEK:
        return this.filterByWeek(taskList);
      case FILTER_PINNED:
        return this.filterByPinned(taskList);
      case FILTER_DATE:
        return this.filterByDate(taskList, this.props.date);
      case FILTER_SEARCH:
        return this.filterSearch(taskList, this.props.query, this.props.category, this.props.pinned, this.props.startInterval, this.props.endInterval);
      default:  
        return taskList;
    }
  }

  render() {
    const tasks = this.filter(
      this.props.filterOption,
      [...this.props.taskList].sort((a,b) => a.dueTime - b.dueTime),
    );

    const sections = Object.keys(tasks).map(key => ({
      data: tasks[key],
      title: key,
    }));

    const largeTextColor = this.props.customize.darkTheme ? colors.DarkPrimaryText : colors.LightPrimaryText;
    const smallTextColor = this.props.customize.darkTheme ? colors.DarkSecondaryText : colors.LightSecondaryText;
    const theme = this.props.customize.darkTheme ? colors.DarkBackground : colors.LightBackground;
    const overlayBorderColor = this.props.customize.darkTheme ? colors.DarkOverlay : colors.LightOverlay;
    const buttonColor = this.props.customize.darkTheme ? "#91a5c7" : colors.SecondaryColor;
    const fontSize = this.props.customize.fontSize;
    const font = this.props.customize.font;
    
    return (
      <>
        {this.props.isNotFilter ? null:
          <SectionList
          sections={sections}
          keyExtractor={(item, index) => item + index}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          ListEmptyComponent={this.props.calendarView ? null : (
            <View style={styles.emptyComponentContainer}>
              <Text style={{color: largeTextColor, fontSize: fontSize, fontFamily: font}}>You're all done now!</Text>
              <Text style={{color: smallTextColor, fontSize: fontSize, fontFamily: font}}>Tap + to create a new task</Text>
              <FontAwesome5 name="tasks" color="grey" size={40} />
            </View>
          )}
          />
        }
        {this.props.create ?
          <Create
            style={styles.addButton}
            buttonColor={buttonColor}
            onPress={this.onAddButtonPress} 
          /> : null
        }
        <Overlay
          isVisible={this.state.showForm} 
          onBackdropPress={this.onFormBackdropPress}
          overlayStyle={[styles.taskForm, { height: Object.keys(this.state.selected).length ? 380 : 320 , backgroundColor: theme, borderColor: overlayBorderColor}]}
        >
          <TaskForm
            {...this.state.selected}
            isOnSelected={Object.keys(this.state.selected).length > 0} 
            onSubmit={this.handleFormSubmit}
            onRemove={this.handleRemoval}
          />
        </Overlay>
      </>
    );
  }
};

const styles = StyleSheet.create({
  listTitle: {
    color: colors.TitleText,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  emptyComponentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 220,
  },
  taskForm: {
    padding: 0,
    borderWidth: 3,
    borderRadius: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});

const mapStateToProps = state => ({
  customize: state.customize,
  taskList: state.userData.data.tasks,
});

const mapDispatchToProps = dispatch => ({
  createTask: bindActionCreators(createTask, dispatch),
  editTask: bindActionCreators(editTask, dispatch),
  removeTask: bindActionCreators(removeTask, dispatch),
  editPinned: bindActionCreators(editPinned, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
