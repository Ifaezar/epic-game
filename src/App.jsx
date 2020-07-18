import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Route,
  Switch,
  withRouter
} from 'react-router-dom';

import Navbar from "./view/components/navbar/navbar";
import HomeScreen from "./view/screen/home/home"
import AuthScreen from './view/screen/home/Auth/auth';
import RegisterScreen from './view/screen/home/Auth/register';
import Cookie from 'universal-cookie'
import { connect } from 'react-redux'
import { cookieChecker, userKeepLogin } from "./redux/action"
import Account from './view/screen/home/user/account/account';
import AdminGame from './view/screen/home/Admin/AdminGame/adminGame';
import AdminMember from './view/screen/home/Admin/AdminGame/adminMember';
import PageNotFound from './view/screen/home/PageNotFound/PageNotFound';
import ProductDetail from './view/screen/home/Product/productDetail';
import Browse from './view/screen/home/Browse/browse';
import Cart from './view/screen/home/user/account/Cart/cart';
import ForgotPassword from './view/screen/home/user/account/ForgotPassword/forgotPassword';
import NewPassword from './view/screen/home/user/account/ForgotPassword/newPassword';
import History from './view/screen/home/user/account/History/history';
import AdminPayment from './view/screen/home/Admin/AdminGame/adminPayment';
import GameLibrary from './view/screen/home/user/account/GameLibrary/gameLibrary';
import SendGame from './view/screen/home/user/account/GameLibrary/sendGame';
import AdminReports from './view/screen/home/Admin/AdminGame/adminReports';

const cookieObject = new Cookie()

class App extends React.Component {
  componentDidMount() {
    let cookieResult = cookieObject.get("authData", { path: "/" })
    console.log(cookieResult)
    if (cookieResult) {
      this.props.userKeepLogin(cookieResult)
    } else {
      this.props.cookieChecker();
    }
  }

  renderAdminRoute = () => {
    if (this.props.user.role === "admin") {
      return <Route exact path="/admin/listmember" component={AdminMember} />
    } else {
      return <Route exact path="*" component={PageNotFound} />
    }
  }

  renderUserRoute = () => {
    if (this.props.user.id) {
      return <Route exact path="/account" component={Account} />
    } else {
      return <Route exact path="*" component={PageNotFound} />
    }
  }

  render() {

    return (
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={HomeScreen} />
          <Route exact path="/browse" component={Browse} />
          <Route exact path="/login" component={AuthScreen} />
          <Route exact path="/register" component={RegisterScreen} />
          <Route exact path="/forgotPassword" component={ForgotPassword} />
          <Route exact path="/newPassword/:email/:id" component={NewPassword} />
          <Route exact path="/product/:id" component={ProductDetail} />
          {this.renderUserRoute()}
          <Route exact path="/account" component={Account} />
          <Route exact path="/gameLibrary" component={GameLibrary} />
          <Route exact path="/sendGame/:gameLibraryId" component={SendGame} />
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/history" component={History} />
          {this.renderAdminRoute()}
          <Route exact path="/admin/listgame" component={AdminGame} />
          <Route exact path="/admin/report" component={AdminReports} />
          <Route exact path="/admin/listmember" component={AdminMember} />
          <Route exact path="/admin/payment" component={AdminPayment} />
          <Route exact path="*" component={PageNotFound} />
        </Switch>
      </>
    );
  }
}

const mapsStateToProps = (state) => {
  return {
    user: state.user
  }
}
const mapsDispatchToProps = {
  userKeepLogin,
  cookieChecker
}
export default connect(mapsStateToProps, mapsDispatchToProps)(withRouter(App));
