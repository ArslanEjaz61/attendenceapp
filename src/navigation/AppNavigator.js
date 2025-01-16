import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import StudentDashboard from '../screens/student/StudentDashboard';
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import CRDashboard from '../screens/cr/CRDashboard';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { token, role } = useSelector((state) => state.auth);

  if (!token) {
    return <AuthNavigator />;
  }

  // Return role-specific navigation
  switch (role) {
    case 'student':
      return (
        <Tab.Navigator>
          <Tab.Screen name="Dashboard" component={StudentDashboard} />
          {/* Add more student screens here */}
        </Tab.Navigator>
      );
    case 'teacher':
      return (
        <Tab.Navigator>
          <Tab.Screen name="Dashboard" component={TeacherDashboard} />
          {/* Add more teacher screens here */}
        </Tab.Navigator>
      );
    case 'cr':
      return (
        <Tab.Navigator>
          <Tab.Screen name="Dashboard" component={CRDashboard} />
          {/* Add more CR screens here */}
        </Tab.Navigator>
      );
    default:
      return <AuthNavigator />;
  }
};

export default AppNavigator;