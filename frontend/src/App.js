import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MonitorForm from './components/MonitorForm';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-monitor" element={<MonitorForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;