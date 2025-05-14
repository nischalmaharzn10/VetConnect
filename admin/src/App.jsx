// src/App.jsx
import Header from './components/header';
import Sidebar from './components/sidebar';
import Routes from './routes';

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          <Routes />
        </div>
      </div>
    </div>
  );
};

export default App;
