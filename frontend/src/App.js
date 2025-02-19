import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MonitorForm from './components/MonitorForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-monitor" element={<MonitorForm />} />
      </Routes>
    </Router>
  );
}

export default App;