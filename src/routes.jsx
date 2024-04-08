import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorPage from './templates/pages/notFound/notFound';
import Header from './templates/parts/header/header';
import CompaniesssTable from './templates/pages/companies/companies/Companies';
import Softwares from './templates/pages/softwares/softwares/Softwares';
import StackTable from './templates/pages/stacks/Stacks';
import UserTable from './templates/pages/People/Users';
import UserProfile from './templates/pages/People/User';
import SoftwareInfo from './templates/pages/softwares/software/Software';
import { useEffect, useState} from 'react';
import LoginComponent from './templates/pages/Login';
import PrivateRoute from './templates/pages/PrivateRoute';
import LogoutComponent from './templates/pages/Logout';
import AddSoftware from './templates/pages/softwares/software/rightBar/addSoftware/AddSoftware';
import CompanyTemplate from './templates/pages/companies/company/CompanyTemplate';
import PostTemplate from './templates/pages/dashboard/PostTemplate';
import Dashboard from './templates/pages/dashboard/Dashboard';
import MyProfile from './templates/pages/People/Me';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

export default function AppRouter(){
  const [theme, setTheme] = useState('dark');
  
  useEffect(() => {
    document.body.className = 'pace-done';
    document.documentElement.lang = 'en';
    document.documentElement.setAttribute('data-bs-theme', theme);

    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600&display=swap';
    document.head.appendChild(link2);

    // Cleanup function to remove the links when the component unmounts
    return () => {
        document.head.removeChild(link1);
        document.head.removeChild(link2);
    };
  }, []);
    return (
      <QueryClientProvider client={new QueryClient()}>
        <main className="container">
        <Router>
            <Header setTheme={setTheme}/>
            <div className="page-content">
          <Routes>
            <Route path='/' element={<LoginComponent/>}/>
            <Route path='/dashboard' element={<PrivateRoute><Dashboard /> </PrivateRoute>}/>
            <Route path='/login' element={<LoginComponent />}/>
            <Route path='/logout' element={<LogoutComponent /> } />
            <Route path='/me' element={<PrivateRoute><MyProfile /> </PrivateRoute> } />
            <Route path='/people' element={<PrivateRoute><UserTable /> </PrivateRoute> } />
            <Route path='/companies' element={<PrivateRoute><CompaniesssTable /> </PrivateRoute> } />
            <Route path="/companies/:companyUid" element={<PrivateRoute><CompanyTemplate /> </PrivateRoute> } />
            <Route path='/companies/add-company' element={<PrivateRoute><CompanyTemplate /> </PrivateRoute> } />
            <Route path='/softwares' element={<PrivateRoute><Softwares /> </PrivateRoute> } />
            <Route path='/softwares/:softwareUid' element={<PrivateRoute><SoftwareInfo /> </PrivateRoute> } />
            <Route path='/softwares/add-software' element={<PrivateRoute><AddSoftware /> </PrivateRoute> } />
            <Route path='/stacks' element={<PrivateRoute><StackTable /> </PrivateRoute> } />
            <Route path='/people/:employeeUid' element={<PrivateRoute><UserProfile /> </PrivateRoute> } />
            <Route path='/posts/add' element={<PrivateRoute><PostTemplate /> </PrivateRoute> } />
            <Route path='/posts/feed' element={<PrivateRoute><Dashboard /> </PrivateRoute> } />
            <Route path='*' element={<ErrorPage />} />
          </Routes>
          </div>
        </Router>
        </main>
      </QueryClientProvider>
    );
  }