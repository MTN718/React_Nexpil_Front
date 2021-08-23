import React from 'react';
import './App.css';
import {
  HomePage,
  PatientPage,
  ChatPage,
  CalendarPage,
  NotificationPage,
  SettingPage,
  UserDetailPage,
  LoginPage,
  RegisterPage,
} from './pages';
import {
  Switch,
  Route,
} from "react-router-dom";
import { routers } from './config/router';

function App() {
  return (
      <div className="super-container">
        <div className="page-main-container">
          <Switch>
            <Route path={routers.HOMEPAGE} exact component={HomePage} />
            <Route path={routers.PATIENTPAGE} exact component={PatientPage} />
            <Route path={routers.CHATPAGE} component={ChatPage} />
            <Route path={routers.CALENDAR_PAGE} component={CalendarPage} />
            <Route path={routers.NOTIFICATION} component={NotificationPage} />
            <Route path={routers.SETTINGS} component={SettingPage} />
            <Route path={routers.DETAIL_PAGE} component={UserDetailPage} />
            <Route path={routers.LOGINPAGE} component={LoginPage} />
            <Route path={routers.REGISTERPAGE} component={RegisterPage} />
            <Route path={routers.SETTINGPAGE} component={SettingPage} />
          </Switch>
        </div>
      </div>
  );
}

export default App;
