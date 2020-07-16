import React from 'react';
import { FlatList, StyleSheet, Text, View, } from 'react-native';

import Category from '../Category';

import colors from '../../styles/colors';


export default class CategoryPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: ["health", "workout", "work", "study", "payment", "entertainment"],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList 
          data={this.state.categories}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <View style={styles.categoryContainer}>
              <Category 
                name={item}
                size={80} 
                onPress={() => this.props.onSubmit(item)} 
              />
              <Text style={styles.categoryName} >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </View>
          )}
          numColumns={3}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  categoryContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  categoryName: {
    color: colors.PrimaryText,
    fontSize: 12,
  },
});