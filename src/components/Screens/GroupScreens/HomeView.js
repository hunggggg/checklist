import React from 'react';
// import Stack from '../../../navigations/Groups'
import { View, StyleSheet, TouchableOpacity, FlatList, Text, SectionList } from 'react-native';
import AntDesgin from 'react-native-vector-icons/AntDesign';
// import Octicons from 'react-native-vector-icons/Octicons';

// import { POLICIES, TEST_DATA, currentUserId } from '../../../utils/GroupEnum'
import { extractDate } from '../../../utils/DateTime';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import colors from '../../../styles/colors';


class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingMenu: false,
    }
  }

  renderItem = ({ item }) => this.state.isShowingMenu ? 
    <TouchableOpacity style={{ backgroundColor: this.props.customize.theme.Overlay }} onPress={() => {}}>
      <Text 
        style={[
          styles.itemText,
          { 
            color: this.props.customize.theme.PrimaryText, 
            fontSize: this.props.customize.fontSize.PrimaryText, 
            fontFamily: this.props.customize.font 
          }
        ]}>{item.name}</Text>
    </TouchableOpacity> : null

  renderSectionHeader = ({ section }) => 
    <TouchableOpacity style={styles.container}>
      <Text 
        style={[
          styles.menuText,
          { fontSize: this.props.customize.fontSize.TitleText, fontFamily: this.props.customize.font }
        ]}>{section.title}</Text>
    </TouchableOpacity>
  
  toggleShowMenu = () => {
    this.setState({ isShowingMenu: !this.state.isShowingMenu });
  }

  filterGroups = groupList => {
    return groupList.reduce((obj, group) => {
      const title = (group.admins.includes(this.props.userData.data.username)) ? 
        "Group you are managing" : "Group you are in";
      return {
        ...obj,
        [title]: [...obj[title], group],
      };
    }, {
      "Groups you are managing": [],
      "Groups you are in": [],
    });
  }

  render() {
    const groups = this.filterGroups(this.props.groupData);
    const sections = Object.keys(groups).map(key => ({
      data: groups[key],
      title: key,
    }));

    return (
      <>
        <SectionList 
          sections={sections}
          keyExtractor={(item, index) => item + index}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
        />
        <TouchableOpacity style={styles.createGroupButton} onPress={() => this.props.navigation.navigate("create-group")}>
          <AntDesgin name="addusergroup" size={30} color="white" />
        </TouchableOpacity>
      </>
    );

    // let userDB = this.props.userDB;
    // let currentUid = this.props.currentUid
    // let groupDB = this.props.groupDB;

    // let groupsOfUser = [];
    // // for (let groupKey of userDB[currentUid].groups) {
    // //   groupsOfUser.push(groupDB[groupKey])
    // // }

    // const DATA = [
    //   {
    //     menuText: "Groups you manage",
    //     type: POLICIES.ADMIN,
    //     groups: groupsOfUser.filter(group => {return group['admins'].includes(currentUserId)})
    //   },
  
    //   {
    //     menuText: "Groups you're in",
    //     type: POLICIES.MEMBER,
    //     groups: groupsOfUser.filter(group => {return group['members'].includes(currentUserId)})
    //   },
    // ];

    // let navigation = this.props.navigation;
    // navigation.setOptions({
    //   headerRight: () => 
    //     <TouchableOpacity
    //       onPress={() => {navigation.navigate('create-group')}}
    //       // onPress={() => navigation.navigate('info', {
    //       //   groupName: route.params.title,
    //       //   title: "Info: " + route.params.title,
    //       // })}
    //     >
    //       <AntDesgin
    //         name="addusergroup"
    //         size={25}
    //       />
    //     </TouchableOpacity>,

    //   headerRightContainerStyle: {padding: 15}
    
    // });

    // return (
    //   <View>
    //   {/* <FlatList
    //     data={DATA}
    //     keyExtractor={item => item.type}
    //     renderItem={({item}) => 
    //       <DropDown
    //         menuText={item.menuText}
    //         type={item.type}
    //         groups={item.groups}
    //         navigation={navigation}
    //       />
    //     }
    //   /> */}
    //   </View>
    // );
  }
}

const mapStateToProps = state => ({
  userData: state.userData,
  groupData: state.groupData,
  customize: state.customize,
});

export default connect(mapStateToProps)(HomeView);


// export function HomeViewOld({navigation, route}) {
//   const { database } = route.params
  
//   console.debug("homeview");
//   console.debug(database);


//   let groupsOfUser = [];
//   for (let groupKey of database.users[currentUserId].groups) {
//     groupsOfUser.push(database.groups[groupKey])
//   }

//   const DATA = [
//     {
//       menuText: "Groups you manage",
//       type: POLICIES.ADMIN,
//       groups: groupsOfUser.filter(group => {return group['admins'].includes(currentUserId)})
//     },

//     {
//       menuText: "Groups you're in",
//       type: POLICIES.MEMBER,
//       groups: groupsOfUser.filter(group => {return group['members'].includes(currentUserId)})
//     },
//   ];

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => 
//         <TouchableOpacity
//           onPress={() => {navigation.navigate('create-group')}}
//           // onPress={() => navigation.navigate('info', {
//           //   groupName: route.params.title,
//           //   title: "Info: " + route.params.title,
//           // })}
//         >
//           <AntDesgin
//             name="addusergroup"
//             size={25}
//           />
//         </TouchableOpacity>,

//       headerRightContainerStyle: {padding: 15}
    
//     });
//   }, [navigation]);

  
//   return (
//     <View>
//       <FlatList
//         data={DATA}
//         keyExtractor={item => item.type}
//         renderItem={({item}) => 
//           <DropDown
//             menuText={item.menuText}
//             type={item.type}
//             groups={item.groups}
//             navigation={navigation}
//           />
//         }
//       />
//     </View>
//   );
// }

// export class DropDown extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isShowingMenu: false,
//     }
//   }

//   toggleShowMenu() {
//     this.setState({isShowingMenu: !this.state.isShowingMenu});
//   }

//   render() {
//     return (
//       <View> 
//         <TouchableOpacity
//           onPress={() => this.toggleShowMenu()}
//           style={styles.container}
//         > 
//           <Text style={styles.menuText}> {this.props.menuText} </Text>
//           <Octicons 
//             name={this.state.isShowingMenu ? "triangle-up" : "triangle-down"}
//             style={{margin:10}}
//             color="white"
//             size={15}
//           />
          
//         </TouchableOpacity>
      
//         {this.state.isShowingMenu? 
//         <View>
//           <FlatList
//             styles={{marginTop:5}}
//             data={this.props.groups}
//             keyExtractor={item => item.name.toString()}
//             renderItem = {({item}) => 
//               <TouchableOpacity
//                 onPress={()=>{
//                   if (this.props.type === POLICIES.ADMIN || this.props.type === POLICIES.MEMBER)
//                   {
//                     this.props.navigation.navigate('group', {
//                       title: item.name,
//                       gid: item.gid,
//                       policy: this.props.type
//                     });
//                   }
//                   // else 
//                   // {
//                   //   this.props.navigation.navigate('invitation', {
//                   //     group: item,
//                   //   }); // should add something here...
//                   // }
//                 }}
//               >
//                 <Text style={styles.itemText}> {item.name} </Text>
//               </TouchableOpacity>
              
//             }

//           />
//         </View>:
//         null
//         }
        
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PrimaryColor,
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    marginVertical: 5,
    marginHorizontal: 8,
    borderRadius: 5,
  }, 
  menuText: {
    color: "white",
    paddingVertical: 8,
    marginLeft:8,
    flex: 1,
  },
  itemText: {
    paddingVertical: 8,
    marginTop: 6,
    marginLeft: 20,
    marginRight: 20, 
    borderRadius: 5,
    paddingLeft: 20,
  },
  itemHeaderContainer: {
    flex:1,
    backgroundColor: colors.SecondaryColor,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,  
    borderRadius: 5,
  },
  createGroupButton: {
    backgroundColor: colors.SecondaryColor,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 15,
    right: 15,
    height: 60,
    width: 60,
    borderRadius: 30,
  },
});
