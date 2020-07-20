import React from 'react';
import { Dimensions, SectionList, StyleSheet, Text, View, } from 'react-native';
import { Overlay } from 'react-native-elements';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Task from './Task';
import TaskForm from './Forms/TaskForm';
import { Create } from './Button';

import colors from '../styles/colors';

import { isToday, getToday, getWeekDates, getNameOfDay, extractDate, extractDateTime } from '../utils/DateTime';

import { createTask, editTask, removeTask, togglePinned, toggleDone } from '../redux/actions/UserDataActions';


export const FILTER_TODAY = "FILTER_TODAY";
export const FILTER_WEEK = "FILTER_WEEK";
export const FILTER_PINNED = "FILTER_PINNED";
export const FILTER_DATE = "FILTER_DATE";
export const FILTER_SEARCH = "FILTER_SEARCH";
export const FILTER_NAME = "FILTER_NAME";
export const FILTER_CATEGORY = "FILTER_CATEGORY";
export const FILTER_OVERDUED = "FILTER_OVERDUED";
export const FILTER_UPCOMING = "FILTER_UPCOMING";
export const FILTER_COMPLETED = "FILTER_COMPLETED";

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      selected: {},
    };
  }

  renderItem = ({ item }) => (
    <Task 
      {...item} 
      onSelect={() => this.onSelectedTaskPress(item)} 
      togglePinned={() => this.props.togglePinned(item)} 
      toggleDone={() => this.props.toggleDone(item)}
      customize={this.props.customize}
    />
  )

  renderSectionHeader = ({ section }) => 
    <Text style={[styles.listTitle, {
      color: this.props.customize.theme.TitleText,
      fontFamily: this.props.customize.font,
      fontSize: this.props.customize.fontSize.TitleText,
    }]}>{section.title}</Text>

  toggleForm = () => {
    this.setState({ showForm: !this.state.showForm })
  }

  onSelectedTaskPress = task => {
    this.setState({ showForm: true, selected: task });
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

  filterByCategory = (taskList, category) => {
    return taskList.filter(task => task.category === category).reduce((obj, task) => {
      const title = category.toUpperCase();
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

  filterOverduedTasks = taskList => {
    let now = getToday();
    return taskList.filter(task => task.dueTime < now && !task.done).reduce((obj, task) => {
      const title = extractDateTime(task.dueTime).date;
      return {
        ...obj,
        [title]: [...(obj[title] || []), task],
      }
    }, {});
  }

  filterUpcomingTasks = taskList => {
    let now = getToday();
    return taskList.filter(task => task.dueTime > now && !task.done).reduce((obj, task) => {
      const title = extractDateTime(task.dueTime).date;
      return {
        ...obj,
        [title]: [...(obj[title] || []), task],
      }
    }, {});
  }

  filterCompletedTasks = taskList => {
    return taskList.filter(task => task.done).reduce((obj, task) => {
      const title = extractDateTime(task.dueTime).date;
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
      const itemPinned = item.pinned;
      const itemDueTime = item.dueTime;
      const startIntervalChecker = startInterval === "" ? 1 : itemDueTime >= startInterval;
      const endIntervalChecker = endInterval === "" ? 1 : itemDueTime <= endInterval;
      const textData = query.toUpperCase();
      if (category === "default" &&
        startInterval === "" &&
        endInterval === "" &&
        !pinned) {
          return false;
      } else if (itemTitle.includes(textData) &&
        (itemCategory === category || category === "default") &&
        startIntervalChecker &&
        endIntervalChecker &&
        itemPinned === pinned) {
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
      case FILTER_CATEGORY:
        return this.filterByCategory(taskList, this.props.category)
      case FILTER_DATE:
        return this.filterByDate(taskList, this.props.date);
      case FILTER_SEARCH:
        return this.filterSearch(taskList,
          this.props.query,
          this.props.category,
          this.props.pinned,
          this.props.startInterval,
          this.props.endInterval
        );
      case FILTER_OVERDUED:
        return this.filterOverduedTasks(taskList);
      case FILTER_UPCOMING:
        return this.filterUpcomingTasks(taskList);
      case FILTER_COMPLETED:
        return this.filterCompletedTasks(taskList);
      default:  
        return { "": taskList };
    }
  }

  render() {
    const theme = this.props.customize.theme;
    const fonts = this.props.customize.fontSize;
    const font = this.props.customize.font;

    const tasks = this.filter(
      this.props.filterOption,
      [...this.props.taskList].sort((a,b) => a.dueTime - b.dueTime),
    );

    const sections = Object.keys(tasks).map(key => ({
      data: tasks[key],
      title: key,
    }));
    
    return (
      <>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item + index}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          ListEmptyComponent={this.props.showEmptyComponent ? (
            <View style={styles.emptyComponentContainer}>
              <Ionicons name="md-cloud-done" color={colors.PrimaryColor} size={120} />
              <Text style={{ color: theme.PrimaryText, fontSize: fonts.HeavyText, fontFamily: font }}>You're all done here!</Text>
              <Text style={{ color: theme.SecondaryText, fontSize: fonts.PrimaryText, fontFamily: font }}>Tap + to create a new task</Text>
            </View>
          ) : null}
        />
        {this.props.create ?
          <Create
            style={styles.addButton}
            onPress={this.toggleForm}
          /> : null
        }
        <Overlay
          isVisible={this.state.showForm} 
          onBackdropPress={this.toggleForm}
          overlayStyle={[
            styles.taskForm, 
            { height: Object.keys(this.state.selected).length ? 350 : 280, backgroundColor: theme.Overlay }
          ]}
        >
          <TaskForm
            {...this.state.selected}
            isOnSelected={Object.keys(this.state.selected).length > 0} 
            onSubmit={this.handleFormSubmit}
            onRemove={this.handleRemoval}
            onBack={this.toggleForm}
            customize={this.props.customize}
          />
        </Overlay>
      </>
    );
  }
};

const styles = StyleSheet.create({
  listTitle: {
    textAlign: "center",
    marginBottom: 5,
  },
  emptyComponentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 180,
  },
  taskForm: {
    padding: 0,
    borderRadius: 5,
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
  togglePinned: bindActionCreators(togglePinned, dispatch),
  toggleDone: bindActionCreators(toggleDone, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
