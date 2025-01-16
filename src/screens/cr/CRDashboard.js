import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Title, DataTable, Button, Menu, Portal, Modal } from 'react-native-paper';
import { useSelector } from 'react-redux';
import axios from '../../services/api';

const CRDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    setStudents(subject.students || []);
    setMenuVisible(false);
  };

  const toggleStudentSelection = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const markAttendance = async () => {
    try {
      const attendance = {
        subjectId: selectedSubject._id,
        date: new Date(),
        studentAttendance: students.map(student => ({
          student: student._id,
          status: selectedStudents.has(student._id) ? 'present' : 'absent'
        }))
      };

      await axios.post('/attendance', attendance);
      setModalVisible(true);
      setSelectedStudents(new Set());
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Welcome, {user.name}</Title>
          <Text>Class Representative Dashboard</Text>
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
        <Card style={styles.card}>
          <Card.Content>
            <Title>Mark Attendance</Title>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>ID</DataTable.Title>
                <DataTable.Title>Present</DataTable.Title>
              </DataTable.Header>

              {students.map((student) => (
                <DataTable.Row key={student._id}>
                  <DataTable.Cell>{student.name}</DataTable.Cell>
                  <DataTable.Cell>{student.studentId}</DataTable.Cell>
                  <DataTable.Cell>
                    <Button
                      mode={selectedStudents.has(student._id) ? 'contained' : 'outlined'}
                      onPress={() => toggleStudentSelection(student._id)}
                    >
                      {selectedStudents.has(student._id) ? 'Present' : 'Absent'}
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>

            <Button
              mode="contained"
              onPress={markAttendance}
              style={styles.submitButton}
              disabled={!selectedSubject || students.length === 0}
            >
              Submit Attendance
            </Button>
          </Card.Content>
        </Card>
      )}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title>Success!</Title>
          <Text>Attendance has been marked successfully.</Text>
          <Button onPress={() => setModalVisible(false)}>Close</Button>
        </Modal>
      </Portal>
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
  submitButton: {
    marginTop: 16,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
});

export default CRDashboard;