import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MonitorForm from './components/MonitorForm';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Layout from './components/Layout';
import AuthRoute from './components/AuthRoute';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<AuthRoute element={Dashboard} />} />
          <Route path="/add-monitor" element={<AuthRoute element={MonitorForm} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
