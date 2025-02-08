import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './app/login/page';
import RegisterPage from './app/register/page';
import Home from './app/home/Home';
import QuizHome from './app/quiz/QuizHome';
import Quiz from './app/quiz/Quiz';
import QuizCreate from './app/quiz/QuizCreate';
import QuizCreate2 from './app/quiz/QuizCreate2';
import { AuthProvider } from './context/AuthContext';
import Profile from './app/profile/Profile';
import ProtectedRoutes from './utils';

function App() {

  return (
    <AuthProvider>
      <Routes>
       
        <Route path='login/' element={<LoginPage />} />
        <Route path='register/' element={<RegisterPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route path='/'>
            <Route path='' element={<Home />} />
            <Route path='quiz/' element={<QuizHome />} />
            <Route path='quiz/create/' element={<QuizCreate />} />
            <Route path='quiz/create/:quizId/questions/' element={<QuizCreate2 />} />
            <Route path='quiz/:quizId/' element={<Quiz />} />
            <Route path='profile/' element={<Profile />} />
          </Route>
        </Route>

      </Routes>
    </AuthProvider>
  )
}

export default App
