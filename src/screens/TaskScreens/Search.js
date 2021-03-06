import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import { SearchBar } from 'react-native-elements';

import { connect } from 'react-redux';

import TaskList, { FILTER_SEARCH } from '../../components/TaskList';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CategoryPicker from '../../components/Forms/CategoryPicker';
import { Overlay } from 'react-native-elements';
import Category from '../../components/Category';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import colors from '../../styles/colors';

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
      isCalendarPressed: false,
      query: "",
      category: "default",
      pinned: 0,
      startInterval: "",
      endInterval: "",
      showFilter: false,
      errorInterval:false,
    };
  }

  updateState = query => {
    this.setState({query: query});
  };

  updateCategory = category => {
    this.setState({ category: category, isCategoryPickerVisible: false });
  }

  onPinnedPress = () => {
    this.setState({pinned: (this.state.pinned + 1) % 3});
  }

  onCalendarPress = () => {
    this.toggleDatePicker();
  }

  onResetPress = () => {
    this.setState({
      isCategoryPressed:false,
      isCalendarPressed: false,
      category: "default",
      pinned: 0,
      startInterval: "",
      endInterval: "",
      errorInterval: false,
    });
  }
  
  handleStartIntervalConfirm = time => {
    time.setHours(0,0,0,0);
    this.setState({startInterval: time, isCalendarPressed: true});
    if (this.state.startInterval > this.state.endInterval && this.state.endInterval !== ""){
      this.setState({errorInterval: true})
    }
    else{
      this.setState({errorInterval: false})
    }
    this.setState({ isStartIntervalPickerVisible: false });
  }

  handleEndIntervalConfirm = time => {
    time.setHours(23,59,59,99);
    this.setState({endInterval: time, isCalendarPressed: true});
    if (this.state.startInterval > this.state.endInterval && this.state.startInterval !== ""){
      this.setState({errorInterval: true})
    }
    else{
      this.setState({errorInterval: false})
    }
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
  }

  toggleCategoryPicker = () => {
    this.setState({ isCategoryPickerVisible: !this.state.isCategoryPickerVisible,isCategoryPressed: !this.state.isCategoryPressed });
  }

  toggleStartIntervalPicker = () => {
    this.setState({isStartIntervalPickerVisible: !this.state.isStartIntervalPickerVisible});
  }
  
  toggleEndIntervalPicker = () => {
    this.setState({isEndIntervalPickerVisible: !this.state.isEndIntervalPickerVisible});
  }

  toggleFilter = () => {
    this.setState({showFilter: !this.state.showFilter, isDatePickerVisible: false});
  }

  toggleIntervalChecker = () => {
    if (this.state.startInterval > this.state.endInterval){
      this.setState({errorInterval: true})
    }
    else{
      this.setState({errorInterval: false})
    }
  }

  filterPinColorPicker = () => {
    if (this.state.pinned === 0){
      return null;
    }
    else if (this.state.pinned === 1){
      return this.props.customize.theme.Overlay;
    }
    else{
      return this.props.customize.theme.Overlay;
    }
  }

  renderDate = (extractedDate, type) => {
    const fonts = this.props.customize.fontSize;
    const font = this.props.customize.font;
    if (extractedDate !== ""){
      return <Text style={{color: "grey", fontFamily: font, fontSize: fonts.FilterBox}}>{`${extractedDate}`}</Text>;
    }
    if (type === "start"){
      return <Text style={{color: "grey", fontFamily: font, fontSize: fonts.FilterBox}}>Start Day</Text>;
    }
    else {
      return <Text style={{color: "grey", fontFamily: font, fontSize: fonts.FilterBox}}>End Day</Text>;
    }
  }

  renderFilter = () => {
    const theme = this.props.customize.theme;
    const fonts = this.props.customize.fontSize;
    const font = this.props.customize.font;
    if (this.state.showFilter) {
      return (
        <View style = {styles.filterBoxContainer}>
          <TouchableOpacity onPress = {this.toggleCategoryPicker} style = {this.state.isCategoryPressed ? [styles.filterButtonContainerPressed, {backgroundColor: theme.Overlay}] : styles.filterButtonContainerUnpressed}>
            <Category name = {this.state.category} size = {fonts.FilterBox - 2}/>
            <Text style = {this.state.isCategoryPressed ? 
              {color: theme.PrimaryText, fontFamily: font, fontSize: fonts.FilterBox} : {color: theme.SecondaryText, fontFamily: font, fontSize: fonts.FilterBox}}
            > {this.state.category.charAt(0).toUpperCase() + this.state.category.slice(1)}
            </Text>
          </TouchableOpacity>
  
          <TouchableOpacity onPress = {this.onPinnedPress} style = {[styles.filterButtonContainerPressed, {backgroundColor: this.filterPinColorPicker()}]}>
            <MaterialCommunityIcons name="pin" size={fonts.FilterBox - 2} color='#2bd1ea' />
            {this.state.pinned === 0 ?<Text style = {{color: theme.SecondaryText, fontFamily: font, fontSize: fonts.FilterBox}}
            >Filter pin</Text>:null
             }  
             {this.state.pinned === 1 ?<Text style = {{color: theme.PrimaryText, fontFamily: font, fontSize: fonts.FilterBox}}
            >Pinned</Text>:null
             } 
             {this.state.pinned === 2 ?<Text style = {{color: theme.PrimaryText, fontFamily: font, fontSize: fonts.FilterBox}}
            >Unpinned</Text>:null
             } 
            
          </TouchableOpacity>
    
          <TouchableOpacity onPress = {this.onCalendarPress} style = {this.state.isCalendarPressed ? [styles.filterButtonContainerPressed, {backgroundColor: theme.Overlay}] : styles.filterButtonContainerUnpressed}>
            <AntDesign name="calendar" size={fonts.FilterBox - 2} color={this.state.isCalendarPressed === true ? "#FD66FF" : 'brown'} />  
            <Text style = {this.state.isCalendarPressed ? 
              {color: theme.PrimaryText, fontFamily: font, fontSize: fonts.FilterBox} : {color: theme.SecondaryText, fontFamily: font, fontSize: fonts.FilterBox}}
            >Interval</Text>
          </TouchableOpacity>
            
          <TouchableOpacity onPress = {this.onResetPress} style = {styles.resetButton}>
            <MaterialCommunityIcons name="restart" size={fonts.FilterBox - 3} color={"grey"}/>
          </TouchableOpacity>
        </View>
      );    
    }
    else return null;
  }

  render() {
    const theme = this.props.customize.theme;
    const fonts = this.props.customize.fontSize;
    const font = this.props.customize.font;

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
      <View style={{ flex: 1, backgroundColor: theme.Background }}>
        <View style={styles.searchBoxContainer}>
          <SearchBar
            round
            containerStyle={[styles.barContainer, {backgroundColor: theme.Background}]}
            inputContainerStyle={[styles.inputContainer, {backgroundColor: theme.Background}]}
            inputStyle={{color: theme.PrimaryText, fontFamily: font, fontSize: fonts.PrimaryText}}
            placeholder="Search your task here..."
            onChangeText={query => this.updateState(query)}
            value={this.state.query}
            searchIcon={<EvilIcons name="search" size={25} color={colors.Button}/>}
            />
          <TouchableOpacity onPress={this.toggleFilter}>
            <MaterialCommunityIcons name="filter-variant" size={35} color={colors.Button}/>     
          </TouchableOpacity>           
        </View>
        {this.renderFilter()}
        {this.state.isDatePickerVisible ? 
          <View style = {[styles.datePickerForm, {backgroundColor: theme.Background}]}>
            <Text style = {{color: theme.SecondaryText, fontSize: fonts.FilterBox}}>From</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={this.toggleStartIntervalPicker}>
              {this.renderDate(extractedStartInterval,"start")}
            </TouchableOpacity>
            <Text style={{color: theme.SecondaryText, fontSize: fonts.FilterBox}}>To</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={this.toggleEndIntervalPicker}>
              {this.renderDate(extractedEndInterval,"end")}
            </TouchableOpacity>
          </View> : null
        }
        {this.state.isDatePickerVisible ?
          <View style = {{
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {this.state.errorInterval ? <Text style = {{ color: 'red', fontSize: fonts.ErrorText}}>The start day should not be larger than the end day</Text> : null}          
          </View> : null
        }        
        <Overlay
          isVisible={this.state.isCategoryPickerVisible}
          onBackdropPress={this.toggleCategoryPicker}
          overlayStyle={[styles.categoryPickerForm, { backgroundColor: theme.Overlay }]}
          animationType="fade"
        >
          <CategoryPicker onSubmit={this.updateCategory} hasDefault={true} customize={this.props.customize} />
        </Overlay>
        <TaskList 
          filterOption = {filterOption}
          query = {this.state.query}
          category = {this.state.category}
          pinned = {this.state.pinned}
          startInterval = {this.state.errorInterval ? "":this.state.startInterval}
          endInterval = {this.state.errorInterval ? "": this.state.endInterval}
          customize={this.props.customize}
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
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  filterButtonContainerUnpressed: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 3,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.Button ,
  },
  filterButtonContainerPressed: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 3,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.Border,
    backgroundColor: "#262729",
  },
  barContainer: {
    flex: 1,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderWidth: 1,
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
    padding: 1,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.Button ,
  },
  datePickerForm:{
    height: 50,
    marginTop: 5,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  datePickerButton: {
    padding: 5,
    marginHorizontal: 10,
    borderColor: colors.Border,
    borderWidth: 1,
    borderRadius: 5,
  },
  itemFormat: {
    marginRight:10,
    marginLeft:10,
    marginTop:10,
    paddingTop:8,
    paddingBottom:8,
    borderRadius:16,
    borderWidth: 8,
  },
});

const mapStateToProps = state => ({
  taskList: state.tasks,
  customize: state.customize,
});

export default connect(mapStateToProps)(Search);
