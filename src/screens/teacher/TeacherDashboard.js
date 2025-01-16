import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Title, DataTable, Button, Searchbar, Menu } from 'react-native-paper';
import { useSelector } from 'react-redux';
import axios from '../../services/api';

const TeacherDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/subjects');
      setSubjects(response.data.filter(subject => subject.teacher === user.id));
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchLowAttendanceStudents = async (subjectId) => {
    try {
      const response = await axios.get('/students/low-attendance', {
        params: { subjectId }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    fetchLowAttendanceStudents(subject._id);
    setMenuVisible(false);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Welcome, {user.name}</Title>
          <Text>Teacher Dashboard</Text>
        </Card.Content>
      </Card>

      <View style={styles.subjectSelector}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button onPress={() => setMenuVisible(true)}>
              {selectedSubject ? selectedSubject.name : 'Select Subject'}
            </Button>
          }
        >
          {subjects.map((subject) => (
            <Menu.Item
              key={subject._id}
              onPress={() => handleSubjectSelect(subject)}
              title={subject.name}
            />
          ))}
        </Menu>
      </View>

      {selectedSubject && (
        <>
          <Searchbar
            placeholder="Search students"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />

          <Card style={styles.card}>
            <Card.Content>
              <Title>Students with Low Attendance</Title>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Name</DataTable.Title>
                  <DataTable.Title>ID</DataTable.Title>
                  <DataTable.Title numeric>Attendance</DataTable.Title>
                </DataTable.Header>

                {filteredStudents.map((student) => (
                  <DataTable.Row key={student._id}>
                    <DataTable.Cell>{student.name}</DataTable.Cell>
                    <DataTable.Cell>{student.studentId}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Text style={{ color: 'red' }}>
                        {student.attendancePercentage.toFixed(1)}%
                      </Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </Card.Content>
          </Card>
        </>
      )}
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
  subjectSelector: {
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 16,
  },
});

export default TeacherDashboard;