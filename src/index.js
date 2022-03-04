import './index.css';
import Trenches from './modules/trenches.js';
import Student from './modules/student.js';
import TrenchesAPI from './modules/api.js';

const trenches = new Trenches();

const addRecentStudent = (trenches, {
  title, score,
}) => {
  const studentsList = document.getElementById('students-list');

  const newStudentsList = document.createElement('li');
  newStudentsList.innerHTML = `
    <p>${title}: ${score}</p>
  `;

  if (trenches.scores.length === 0) {
    studentsList.innerHTML = '';
  }

  studentsList.appendChild(newStudentsList);
  trenches.addNewScore(new Student(title, score));
};

const studentListener = async (trenches) => {
  const studentForm = document.getElementById('add-student-form');
  const newScore = new Student(studentForm.elements.title.value, studentForm.elements.score.value);
  const isAPI = await TrenchesAPI.addNewScore(trenches.gameID, {
    user: newScore.title,
    score: newScore.score,
  });
  if (isAPI === null) {
    return;
  }

  addRecentStudent(trenches, {
    title: newScore.title,
    score: newScore.score,
  });

  studentForm.reset();
};

const refreshButtonEventListener = async (trenches) => {
  const studentsList = document.getElementById('students-list');
  studentsList.innerHTML = `
    <p class="inner-text">Hold on Refresh in progress...</p>
  `;

  const data = await TrenchesAPI.getScores(trenches.gameID);
  if (data === null) {
    return;
  }

  data.sort((a, b) => b.score - a.score);

  trenches.clearArray();
  studentsList.innerHTML = '';

  data.forEach((score) => {
    addRecentStudent(trenches, {
      title: score.user,
      score: score.score,
    });
  });

  if (trenches.scores.length === 0) {
    document.getElementById('students-list').innerHTML = `
      <p class="inner-text">No Scores yet.</p>
    `;
  }
};

document.getElementById('students-list').innerHTML = `
  <p class="inner-text">No Scores Yet.</p>
`;

document.getElementById('add-student-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await studentListener(trenches);
});

document.getElementById('refresh-score').addEventListener('click', async (e) => {
  e.preventDefault();
  await refreshButtonEventListener(trenches);
});