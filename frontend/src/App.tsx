import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './app/login/page';
import RegisterPage from './app/register/page';

function App() {

  return (
    <>
      <Routes>
        <Route path='/'>
          <Route path='login/' element={<LoginPage />}></Route>
          <Route path='register/' element={<RegisterPage />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
