import { useRouter } from 'expo-router';
import { Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <Button title='login' onPress={() => router.push('/login')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
