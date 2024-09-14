import { useRouter } from 'expo-router';
import { Plus } from 'phosphor-react-native';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddButton({ routeName }: { routeName: string }) {
  const router = useRouter();
  return (
    <View style={styles.floatingBtnContainer}>
      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => router.push(routeName)}
      >
        <Text style={styles.floatingBtnText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBtnContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    top: Platform.OS === 'ios' ? 20 : 0,
  },
  floatingBtn: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'black',
    shadowColor: 'lightgray',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  floatingBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
