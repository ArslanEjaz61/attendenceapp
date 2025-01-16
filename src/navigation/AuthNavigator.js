import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import StudentDashboard from '../screens/student/StudentDashboard';
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import CRDashboard from '../screens/cr/CRDashboard';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      <Stack.Screen name="CRDashboard" component={CRDashboard} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;