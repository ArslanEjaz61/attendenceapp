import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { authAPI } from '../../services/api';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Send the login request
      const response = await authAPI.login({ username, password });

      // Dispatch user data to Redux store
      dispatch(setCredentials({
        user: response.user,
        role: response.role
      }));

      // Navigate based on the role
      switch (response.role) {
        case 'teacher':
          navigation.replace('TeacherDashboard');
          break;
        case 'student':
          navigation.replace('StudentDashboard');
          break;
        case 'cr':
          navigation.replace('CRDashboard');
          break;
        default:
          setError('Invalid role');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Image source={require('../../assets/bzu_logo.png')} style={styles.logo} />
        <Title style={styles.title}>University Attendance</Title>
        
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
          disabled={loading}
          left={<TextInput.Icon name="account" />}
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          disabled={loading}
          left={<TextInput.Icon name="lock" />}
        />

        {error ? (
          <HelperText type="error" visible={true}>
            {error}
          </HelperText>
        ) : null}

        <Button 
          mode="contained" 
          onPress={handleLogin} 
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Login
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7F8FC',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0066CC',
    marginTop: 20,
  },
});

export default LoginScreen;
