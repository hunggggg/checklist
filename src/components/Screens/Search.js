import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CategoryPicker from './../Form/CategoryPicker';
import { Overlay } from 'react-native-elements';
import Category from '../Category';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import screenStyles from './screenStyles';
import colors from '../../styles/colors';
import 'react-native-gesture-handler';
import TaskList, {FILTER_SEARCH} from './../TaskList'
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { createTask, editTask, removeTask } from '../../redux/actions/TaskActions';
import { extractDate } from '../../utils/DateTime';

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDatePickerVisible: false,
      isStartIntervalPickerVisible: false,
      isEndIntervalPickerVisible: false,
      isCategoryPickerVisible: false,
      isCategoryPressed: false,
      isPinnedPressed: false,
      isCalendarPressed: false,
      query: "",
      category: "default",
      pinned: false,
      startInterval: "",
      endInterval: "",
      showFilter: false,
      date: "",
    };
  }

  updateState = query => {
    this.setState({query: query});
  };

  updateCategory = category => {
    this.setState({ category: category });
  }

  onPinnedPress = () => {
    this.setState({isPinnedPressed: !this.state.isPinnedPressed,  pinned: !this.state.pinned});
  }

  onCalendarPress = (interval) => {
    this.toggleDatePicker();
  }

  onResetPress = () => {
    this.setState({
      isPinnedPressed: false,
      isCategoryPressed:false,
      isCalendarPressed: false,
      category: "default",
      pinned: false,
      startInterval: "",
      endInterval: "",
    });
  }
  
  handleStartIntervalConfirm = time => {
    time.setHours(0,0,0,0);
    this.setState({startInterval: time});
    this.setState({ isStartIntervalPickerVisible: false });
  }

  handleEndIntervalConfirm = time => {
    time.setHours(23,59,59,99);
    this.setState({endInterval: time});
    this.setState({ isEndIntervalPickerVisible: false });
  }

  toggleStartIntervalPicker = () => {
    this.setState({isStartIntervalPickerVisible: !this.state.isStartIntervalPickerVisible})
  }

  toggleEndIntervalPicker = () => {
    this.setState({isEndIntervalPickerVisible: !this.state.isEndIntervalPickerVisible})
  }

  toggleDatePicker = () => {
    this.setState({ isDatePickerVisible: !this.state.isDatePickerVisible});
    if (this.state.startInterval !== "" || this.state.endInterval !== ""){
      this.setState({isCalendarPressed: true})
    }
  }

  toggleCategoryPicker = () => {
    this.setState({ isCategoryPickerVisible: !this.state.isCategoryPickerVisible,isCategoryPressed: !this.state.isCategoryPressed });
  }

  toggleFilter = () => {
    this.setState({showFilter: !this.state.showFilter, isDatePickerVisible: false});
  }

  renderCategoryBox = () => {
    if (this.state.category){
      return(
        <View style = {this.state.isCategoryPressed ? styles.filterButtonContainerPressed:styles.filterButtonContainerUnpressed}>
          <Category name = {this.state.category} size = {15}/>
          <Text style = {this.state.isCategoryPressed ? styles.filterBoxTextPressed:styles.filterBoxTextUnpressed}
          > {this.state.category.charAt(0).toUpperCase() + this.state.category.slice(1)}
          </Text>
        </View>
      );
      }
      else{
        return (
          <View style = {this.state.isCategoryPressed ? styles.filterButtonContainerPressed:styles.filterButtonContainerUnpressed}> 
          <Category name = {this.state.category} size = {15}/>
            <Text style = {this.state.isCategoryPressed ? styles.filterBoxTextPressed:styles.filterBoxTextUnpressed}
            > {this.state.category}
            </Text>
          </View>
        );
      }
  }

  renderDate = (extractedDate, type) => {
    if (extractedDate !== ""){
      return(
        <Text style={styles.datePickerText}>{`${extractedDate}`}</Text>
      );
    }
    if (type === "start"){
      return (
        <Text>Start Day</Text>
      );
    }
    else {
      return (
        <Text>End Day</Text>
      );
    }    
  }

  renderFilter = () => {
    if(this.state.showFilter){
      return(
        <View style = {styles.filterBoxContainer}>
        <TouchableOpacity onPress = {this.toggleCategoryPicker} >
          {this.renderCategoryBox()}
        </TouchableOpacity>
  
        <TouchableOpacity onPress = {this.onPinnedPress}>
          <View style = {this.state.isPinnedPressed ? styles.filterButtonContainerPressed:styles.filterButtonContainerUnpressed}>
            <MaterialCommunityIcons name="pin" size={15} color='#2bd1ea' />  
            <Text style = {this.state.isPinnedPressed ? styles.filterBoxTextPressed:styles.filterBoxTextUnpressed}> Pinned Task</Text>
          </View>
        </TouchableOpacity>
  
        <TouchableOpacity onPress = {this.onCalendarPress}>
          <View style = {this.state.isCalendarPressed ? styles.filterButtonContainerPressed:styles.filterButtonContainerUnpressed}>
            <AntDesign name="calendar" size={15} color= {this.state.isCalendarPressed === true ? "#FD66FF" : 'brown'} />  
            <Text style = {this.state.isCalendarPressed ? styles.filterBoxTextPressed:styles.filterBoxTextUnpressed}> Interval</Text>
          </View>
        </TouchableOpacity>
          
        <TouchableOpacity onPress = {this.onResetPress}>
        <View style = {styles.resetButton}>
          <MaterialCommunityIcons name = "restart"/>
        </View>
        </TouchableOpacity>
      </View>
      );    
    }
    else{
      return null;
    }
  }
  render() {
    const filterOption = FILTER_SEARCH;
    var extractedStartInterval= "";
    var extractedEndInterval = "";
    if (this.state.startInterval !== ""){
      extractedStartInterval =  extractDate(this.state.startInterval);
    }
    if(this.state.endInterval !== ""){
      extractedEndInterval = extractDate(this.state.endInterval);
    }
     return (    
      <View style={screenStyles.screenContainer}>
        <View style={styles.searchBoxContainer}>
        <SearchBar
          round
          containerStyle={styles.barContainer}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          placeholder="Search your task here..."
          onChangeText={query => this.updateState(query)}
          value={this.state.query}
          searchIcon={<EvilIcons name="search" size={25} />}
          />
          <TouchableOpacity onPress={this.toggleFilter}>
          <MaterialCommunityIcons name="filter-variant" size={30} color={colors.Button}/>     
          </TouchableOpacity>
           
        </View>
        {this.renderFilter()}
        {
          this.state.isDatePickerVisible ? 
          <View style = {styles.datePickerForm}>
            <Text style = {{
              color: colors.SecondaryText,
              fontSize: 15,
            }}>From       </Text>
               <TouchableOpacity style={styles.datePickerButton} onPress={this.toggleStartIntervalPicker}>
              {this.renderDate(extractedStartInterval,"start")}
            </TouchableOpacity>
            <Text style = {{
              color: colors.SecondaryText,
              fontSize: 15,
            }}>     To         </Text>
               <TouchableOpacity style={styles.datePickerButton} onPress={this.toggleEndIntervalPicker}>
              {this.renderDate(extractedStartInterval,"end")}
            </TouchableOpacity>
            </View>:null
        }        
        <Overlay
            isVisible={this.state.isCategoryPickerVisible}
            onBackdropPress={this.toggleCategoryPicker}
            overlayStyle={styles.categoryPickerForm}
          >
            <CategoryPicker onBack={this.toggleCategoryPicker} onSubmit={this.updateCategory} hasDefault = {true} />
          </Overlay>
        <TaskList 
          filterOption = {filterOption}
          query = {this.state.query}
          category = {this.state.category}
          pinned = {this.state.pinned}
          startInterval = {this.state.startInterval}
          endInterval = {this.state.endInterval}
        />
        
          <DateTimePickerModal
            isVisible={this.state.isStartIntervalPickerVisible}
            mode="date"
            onConfirm={this.handleStartIntervalConfirm}
            onCancel={this.toggleStartIntervalPicker}
          />
          <DateTimePickerModal
            isVisible={this.state.isEndIntervalPickerVisible}
            mode="date"
            onConfirm={this.handleEndIntervalConfirm}
            onCancel={this.toggleEndIntervalPicker}
          />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  searchBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  filterBoxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  filterButtonContainerUnpressed: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.Button ,
    marginHorizontal: 14,
  },
  filterButtonContainerPressed: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.Button ,
    backgroundColor: colors.Button,
    marginHorizontal: 14,
  },
  barContainer: {
    flex: 1,
    backgroundColor: colors.Background,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  inputContainer: {
    backgroundColor: colors.Background,
    borderBottomWidth: 1,
    borderWidth: 1,
  },
  inputText: {
    color: colors.PrimaryText,
    fontSize: 18,
  },
  filterBoxTextUnpressed: {
    color: colors.SecondaryText,
    fontSize: 13,
  },
  filterBoxTextPressed: {
    color: colors.Background,
    fontSize: 13,
  },
  categoryPickerButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  categoryPickerForm: { 
    padding: 0,
    height: 280,
    width: 300,
    borderRadius: 5,
  },
  resetButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.Button ,
    marginHorizontal: 14,
  },
  datePickerForm:{
    height: 50,
    borderRadius: 15,
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: 'white',
    flexDirection: "row",
    padding: 0,
    borderRadius: 5,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  datePickerText: {
    fontSize: 16,
  },
  datePickerButton: {
    padding: 5,
    marginRight: 10,
    borderColor: colors.Border,
    borderWidth: 1,
    borderRadius: 5,
  },
});
const mapStateToProps = state => ({
  taskList: state.tasks,
});

const mapDispatchToProps = dispatch => ({
  createTask: bindActionCreators(createTask, dispatch),
  editTask: bindActionCreators(editTask, dispatch),
  removeTask: bindActionCreators(removeTask, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);