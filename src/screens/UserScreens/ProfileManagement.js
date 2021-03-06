import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Overlay } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Header from '../../components/Header';
import { AvatarPicker, InformationBox, PasswordBox, ConfirmPasswordBox } from '../../components/Forms/UserInformationForm';
import ConfirmationBox from '../../components/Forms/ConfirmationBox';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontTisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { FILTER_OVERDUED, FILTER_UPCOMING, FILTER_COMPLETED } from '../../components/TaskList';

import colors from '../../styles/colors';

import { setAvatar, setName, setPhone, logOut, deactivateUser, clearData } from '../../redux/actions/UserDataActions';
import { ErrorBox } from './LogIn'

class ProfileManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAvatarPickerVisible: false,
      isInformationBoxVisible: false,
      isPasswordBoxVisible: false,
      isConfirmPasswordBoxVisible: false,
      isConfirmationBoxVisible: false,
      informationType: "",
      error: false,
      errorMessage: "",
    };
  }

  toggleAvatarPicker = () => {
    if (this.props.connected) this.setState({ isAvatarPickerVisible: !this.state.isAvatarPickerVisible });
  }

  handleAvatarSubmit = color => {
    this.props.setAvatar(color);
    this.setState({ isAvatarPickerVisible: false });
  }

  toggleInformationBox = type => {
    if (this.props.connected) this.setState({ informationType: type, isInformationBoxVisible: !this.state.isInformationBoxVisible });
  }

  handleInformationSubmit = (info, type) => {
    switch(type) {
      case "name":
        this.props.setName(info);
        break;
      case "phone":
        this.props.setPhone(info);
        break;
      default:
        break;
    }
    this.setState({ isInformationBoxVisible: false });
  }

  togglePasswordBox = () => {
    if (this.props.connected) this.setState({ isPasswordBoxVisible: !this.state.isPasswordBoxVisible });
  }

  handlePasswordSubmit = () => {
    this.setState({ isPasswordBoxVisible: false });
  }

  toggleConfirmPasswordBox = () => {
    if (this.props.connected) this.setState({ isConfirmPasswordBoxVisible: !this.state.isConfirmPasswordBoxVisible });
  }

  handleConfirmPasswordSuccess = () => {
    this.setState({ isConfirmPasswordBoxVisible: false, isConfirmationBoxVisible: true });
  }

  toggleConfirmationBox = () => {
    this.setState({ isConfirmationBoxVisible: !this.state.isConfirmationBoxVisible });
  }

  handleRemoveAccountConfirm = () => {
    if (this.props.appData.data.groups.length !== 0) {
      // ko cho xoa
      Alert.alert(
        'Deactivate account ? ',
        'Please leave all groups before deactivating your account !',
        [
          { text: 'OK' }
        ],
        { cancelable: false }
      );
    } else {
      this.props.clearData();
      deactivateUser();
    }
    this.setState({isConfirmationBoxVisible: false});
  }

  handleLogOut = () => {
    this.props.clearData();
    logOut();
  }

  render() {
    const theme = this.props.customize.theme;
    const fonts = this.props.customize.fontSize;
    const font = this.props.customize.font;

    const data = this.props.appData.data;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: theme.Background }}>
        <Header navigation={this.props.navigation} />
        <View style={styles.header}>
          <TouchableOpacity onPress={this.toggleAvatarPicker}>
            <FontAwesome
              style={styles.userAvatar}
              name="user-circle"
              color={data.avatar}
              size={100}
            />
          </TouchableOpacity>
          <Text style={{color: data.avatar, fontFamily: font, fontSize: fonts.UsernameText}}>{`@${data.username}`}</Text>
        </View>
        <View style={styles.statisticContainer}>
          <TouchableOpacity
            style={[styles.statisticBox, { borderRightWidth: 0.5 }]}
            onPress={() => this.props.navigation.navigate("List", { filterOption: FILTER_OVERDUED })}
          >
            <Text style={{color: colors.DisabledColor, fontFamily: font, fontSize: fonts.TertiaryText}}>You have</Text>
            <Text style={{color: colors.DisabledColor, fontFamily: font, fontSize: fonts.HeavyText}}>
              {data.tasks.filter(task => task.dueTime < new Date() && !task.done).length}
            </Text>
            <Text style={{color: colors.DisabledColor, fontFamily: font, fontSize: fonts.TertiaryText}}>OVERDUED</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statisticBox, { borderRightWidth: 0.5 }]}
            onPress={() => this.props.navigation.navigate("List", { filterOption: FILTER_UPCOMING })}
          >
            <Text style={{color: colors.PrimaryColor, fontFamily: font, fontSize: fonts.TertiaryText}}>You have</Text>
            <Text style={{color: colors.PrimaryColor, fontFamily: font, fontSize: fonts.HeavyText}}>
              {data.tasks.filter(task => task.dueTime > new Date() && !task.done).length}
            </Text>
            <Text style={{color: colors.PrimaryColor, fontFamily: font, fontSize: fonts.TertiaryText}}>UPCOMING</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statisticBox}
            onPress={() => this.props.navigation.navigate("List", { filterOption: FILTER_COMPLETED })}
          >
            <Text style={{color: colors.SecondaryColor, fontFamily: font, fontSize: fonts.TertiaryText}}>You have</Text>
            <Text style={{color: colors.SecondaryColor, fontFamily: font, fontSize: fonts.HeavyText}}>
              {data.tasks.filter(task => task.done).length}
            </Text>
            <Text style={{color: colors.SecondaryColor, fontFamily: font, fontSize: fonts.TertiaryText}}>COMPLETED</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.infoField} onPress={() => this.toggleInformationBox("name")}>
          <AntDesign name="contacts" size={30} color={colors.PrimaryColor} />
          <View style={styles.infoText}>
            <Text style={{color: theme.TitleText, fontFamily: font, fontSize: fonts.PrimaryText}}>Full Name</Text>
            <Text style={{color: theme.SecondaryText, fontFamily: font, fontSize: fonts.PrimaryText}}>{data.name || "What's your name?"}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={30} color={colors.Button} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoField}>
          <FontTisto name="email" size={30} color={colors.PrimaryColor} />
          <View style={styles.infoText}>
            <Text style={{color: theme.TitleText, fontFamily: font, fontSize: fonts.PrimaryText}}>Email</Text>
            <Text style={{color: theme.SecondaryText, fontFamily: font, fontSize: fonts.PrimaryText}}>{data.email}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={30} color={colors.Button} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoField} onPress={() => this.toggleInformationBox("phone")}>
          <FontTisto name="phone" size={30} color={colors.PrimaryColor} />
          <View style={styles.infoText}>
            <Text style={{color: theme.TitleText, fontFamily: font, fontSize: fonts.PrimaryText}}>Phone number</Text>
            <Text style={{color: theme.SecondaryText, fontFamily: font, fontSize: fonts.PrimaryText}}>{data.phone || "Update your phone number"}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={30} color={colors.Button} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoField} onPress={this.togglePasswordBox}>
          <FontAwesome name="key" size={30} color={colors.PrimaryColor} />
          <View style={styles.infoText}>
            <Text style={{color: theme.TitleText, fontFamily: font, fontSize: fonts.PrimaryText}}>Change password</Text>
            <Text style={{color: theme.SecondaryText, fontFamily: font, fontSize: fonts.PrimaryText}}>Reset your password</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={30} color={colors.Button} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoField} onPress={this.toggleConfirmPasswordBox}>
          <MaterialCommunityIcons name="account-remove" size={30} color={colors.PrimaryColor} />
          <View style={styles.infoText}>
            <Text style={{color: theme.TitleText, fontFamily: font, fontSize: fonts.PrimaryText}}>Deactivate account</Text>
            <Text style={{color: theme.SecondaryText, fontFamily: font, fontSize: fonts.PrimaryText}}>Remove your account</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={30} color={colors.Button} />
        </TouchableOpacity>
        {/* {this.state.error ? 
          <ErrorBox 
            error={this.state.errorMessage}
            customize={this.props.customize}
          /> : null
        } */}
        <TouchableOpacity style={styles.logOut} onPress={this.handleLogOut}>
          <Text style={[styles.logOutText, {fontFamily: font, fontSize: fonts.ButtonText}]}>LOG OUT</Text>
          <MaterialCommunityIcons name="logout" size={25} color="white" />
        </TouchableOpacity>
        <Overlay
          isVisible={this.state.isAvatarPickerVisible}
          onBackdropPress={this.toggleAvatarPicker}
          overlayBackgroundColor={theme.Overlay}
          overlayStyle={styles.avatarPicker}
          children={
            <AvatarPicker 
              onSubmit={this.handleAvatarSubmit} 
              customize={this.props.customize}
            />
          }
          animationType="fade"
        />
        <Overlay
          isVisible={this.state.isInformationBoxVisible}
          onBackdropPress={this.toggleInformationBox}
          overlayBackgroundColor={theme.Overlay}
          overlayStyle={styles.informationBox}
          children={
            <InformationBox
              info={data[this.state.informationType]}
              type={this.state.informationType}
              inputTitle={`Edit your ${this.state.informationType}`}
              placeholder={`Enter your ${this.state.informationType} here`}
              onSubmit={this.handleInformationSubmit}
              customize={this.props.customize}
            />
          }
          animationType="fade"
        />
        <Overlay
          isVisible={this.state.isPasswordBoxVisible}
          onBackdropPress={this.togglePasswordBox}
          overlayBackgroundColor={theme.Overlay}
          overlayStyle={styles.passwordBox}
          children={
            <PasswordBox
              onSubmit={this.handlePasswordSubmit}
              customize={this.props.customize}
            />
          }
          animationType="fade"
        />
        <Overlay
          isVisible={this.state.isConfirmPasswordBoxVisible}
          onBackdropPress={this.toggleConfirmPasswordBox}
          overlayBackgroundColor={theme.Overlay}
          overlayStyle={styles.confirmPasswordBox}
          children={
            <ConfirmPasswordBox
              onSubmit={this.handleConfirmPasswordSuccess}
              customize={this.props.customize}
            />
          }
          animationType="fade"
        />
        <Overlay
          isVisible={this.state.isConfirmationBoxVisible}
          onBackdropPress={this.toggleConfirmationBox}
          overlayBackgroundColor={theme.Overlay}
          overlayStyle={styles.confirmationBox}
          children={
            <ConfirmationBox 
              title="Delete this account?"
              onCancel={this.toggleConfirmationBox}
              onConfirm={this.handleRemoveAccountConfirm}
              customize={this.props.customize}
            />
          }
          animationType="fade"
        />

        
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  header: {   
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  userAvatar: {
    backgroundColor: "white",
    borderRadius: 50,
  },
  statisticContainer: {
    flexDirection: "row"
  },
  statisticBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginBottom: 10,
    borderColor: colors.Border,
  },
  infoField: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  infoText: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logOut: {
    flexDirection: "row",
    backgroundColor: colors.SecondaryColor,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    margin: 40,
    padding: 5,
  },
  logOutText: {
    color: "white",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  avatarPicker: {
    height: 160,
    width: 300,
    borderRadius: 5,
  },
  informationBox: {
    height: 140,
    width: 300,
    borderRadius: 5,
  },
  passwordBox: {
    height: 300,
    width: 300,
    borderRadius: 5,
  },
  confirmPasswordBox: {
    height: 220,
    width: 300,
    borderRadius: 5,
  },
  confirmationBox: {
    height: 150,
    width: 300,
    borderRadius: 5,
  },
  alertBox: {
    height: 150,
    width: 300,
    borderRadius: 5,
  },
});

const mapStateToProps = state => ({
  customize: state.customize,
  appData: state.userData,
  connected: state.userData.connected,
});

const mapDispatchToProps = dispatch => ({
  setAvatar: bindActionCreators(setAvatar, dispatch),
  setName: bindActionCreators(setName, dispatch),
  setPhone: bindActionCreators(setPhone, dispatch),
  clearData: bindActionCreators(clearData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileManagement);
