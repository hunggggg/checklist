import React from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import screenStyles from './ScreenStyles';
import colors from '../../styles/colors';

import { createUser, isUsernameExisting, isEmailExisting } from '../../api';


export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: "",
        email: "",
        password: "",
        confirmedPassword: "",
      },
      errorText: "",
      error: false,
    };
  }

  toggleDrawer = () => {
    this.props.navigation.toggleDrawer();
  }

  onChangeUserName = text => {
    this.setState({ user: { ...this.state.user, username: text } });
  }

  onChangeEmail = text => {
    this.setState({ user: { ...this.state.user, email: text } });
  }

  onChangePassword = text => {
    this.setState({ user: { ...this.state.user, password: text } });
  }

  onConfirmPassword = text => {
    this.setState({ user: { ...this.state.user, confirmedPassword: text } });
  }

  checkEmptyEntry = () => {
    return (this.state.user.username.trim() === "" || this.state.user.password.trim() === "");
  }

  checkInvalidEmail = (email) => {
    var format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(format) === null;
  }

  checkUnmatchedPassword = (password, confirmedPassword) => {
    return password !== confirmedPassword;
  }

  clearAllInput = () => {
    this.setState({
      user: {
        username: "",
        email: "",
        password: "",
        confirmedPassword: "",
      },
    });
  }

  turnOffAlert = () => {
    this.setState({ error: false });
  }

  handleSubmit = async () => {
    if (await isUsernameExisting(this.state.user.username)) {
      this.setState({ error: true, errorText: "Sorry, this username has existed." });
    } else if (await isEmailExisting(this.state.user.email)) {
      this.setState({ error: true, errorText: "Sorry, this email has existed." })
    } else if (this.checkEmptyEntry()) {
      this.setState({ error: true, errorText: "Please don't leave any field empty." });
    } else if (this.checkInvalidEmail(this.state.user.email)) {
      this.setState({ error: true, errorText: "Invalid email." });
    } else if (this.checkUnmatchedPassword(this.state.user.password, this.state.user.confirmedPassword)) {
      this.setState({ error: true, errorText: "Unmatched password, please make sure you input correctly." });
    } else {
      var data = this.state.user;
      delete data.confirmedPassword;
      createUser(data);
      this.clearAllInput();
      this.props.navigation.goBack();
    }
  }
  
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[screenStyles.screenContainer, styles.container]}>
          <Text style={styles.title}>SIGN UP</Text>
          <View style={styles.inputField}>
            <Text style={styles.inputTitle}>Username</Text>
            <TextInput style={styles.input}
              placeholder="Enter username"
              placeholderTextColor={colors.SecondaryText}
              onChangeText={this.onChangeUserName}
              defaultValue={this.state.username}
              onFocus={this.turnOffAlert}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputField}>
            <Text style={styles.inputTitle}>Email</Text>
            <TextInput style={styles.input}
              placeholder="Enter email"
              placeholderTextColor={colors.SecondaryText}
              onChangeText={this.onChangeEmail}
              defaultValue={this.state.email}
              onFocus={this.turnOffAlert}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputField}>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput style={styles.input}
              placeholder="Enter password"
              placeholderTextColor={colors.SecondaryText}
              onChangeText={this.onChangePassword}
              defaultValue={this.state.password}
              onFocus={this.turnOffAlert}
              secureTextEntry={true}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputField}>
            <Text style={styles.inputTitle}>Confirm password</Text>
            <TextInput style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor={colors.SecondaryText}
              onChangeText={this.onConfirmPassword}
              defaultValue={this.state.confirmedPassword}
              onFocus={this.turnOffAlert}
              secureTextEntry={true}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={this.handleSubmit}
          >
            <Text style={styles.submitText}>SIGN UP</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.otherOptionsButton}
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.otherOptionsText}>Back to Login</Text>
          </TouchableOpacity>
          {(this.state.error) ? 
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>{this.state.errorText}</Text>
            </View> : null
          }
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.PrimaryColor,
    fontSize: 30,
    fontWeight: "bold",
  },
  inputField: {
    alignSelf: "stretch",
    paddingHorizontal: 25,
    paddingVertical: 5,
  },
  inputTitle: {
    color: colors.TitleText,
    fontSize: 20,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    borderColor: colors.Border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: colors.SecondaryColor,
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius: 5,
    marginHorizontal: 40,
    marginVertical: 15,
    paddingVertical: 5,
  },
  submitText: {
    color: "white",
    fontSize: 20,
  },
  otherOptionsButton: {
    paddingHorizontal: 5,
  },
  otherOptionsText: {
    color: colors.PrimaryColor,
  },
  alertBox: {
    backgroundColor: colors.ErrorText,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
  },
  alertText: {
    color: "white",
    fontSize: 14,
  },
});
