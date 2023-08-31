import {
    View,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
  } from 'react-native';
  import React from 'react';
  
  const OverlayActivityIndicator = ({visible}: any) => {
    if (!visible) {
      return null; // Don't render anything if the overlay is not visible
    }
    return (
      <TouchableOpacity activeOpacity={1} style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#FDA40F" />
        </View>
      </TouchableOpacity>
    );
  };
  
  export default OverlayActivityIndicator;
  
  const styles = StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change the opacity as needed
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    container: {
      borderRadius: 10,
      padding: 20,
    },
  });
  