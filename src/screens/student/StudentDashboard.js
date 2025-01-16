import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, DataTable, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import axios from '../../services/api';

const StudentDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/subjects');
      setSubjects(response.data);
      
      // Fetch attendance analytics for each subject
      const analyticsData = {};
      for (const subject of response.data) {
        const analytics = await axios.get('/attendance/analytics', {
          params: { subjectId: subject._id, studentId: user.id }
        });
        analyticsData[subject._id] = analytics.data;
      }
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Welcome, {user.name}</Title>
          <Paragraph>Student ID: {user.studentId}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Attendance Overview</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Subject</DataTable.Title>
              <DataTable.Title numeric>Present</DataTable.Title>
              <DataTable.Title numeric>Total</DataTable.Title>
              <DataTable.Title numeric>Percentage</DataTable.Title>
            </DataTable.Header>

            {subjects.map((subject) => {
              const subjectAnalytics = analytics[subject._id] || {};
              const isLowAttendance = (subjectAnalytics.percentage || 0) < 75;

              return (
                <DataTable.Row key={subject._id}>
                  <DataTable.Cell>{subject.name}</DataTable.Cell>
                  <DataTable.Cell numeric>{subjectAnalytics.presentClasses || 0}</DataTable.Cell>
                  <DataTable.Cell numeric>{subjectAnalytics.totalClasses || 0}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={{ color: isLowAttendance ? 'red' : 'green' }}>
                      {subjectAnalytics.percentage?.toFixed(1) || 0}%
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={fetchSubjects}
        style={styles.refreshButton}
      >
        Refresh Data
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  refreshButton: {
    marginVertical: 16,
  },
});

export default StudentDashboard;