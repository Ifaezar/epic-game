import Axios from 'axios'
import { API_URL } from "../API"
import userTypes from "../types/user"
import Cookie from "universal-cookie";
import reducers from '../reducers';

const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT, ON_REGISTER_SUCCESS } = userTypes

const cookieObj = new Cookie();

export const loginHandler = (userData) => {
    return (dispatch) => {
        Axios.post(`${API_URL}/users/login`, userData)
            .then((res) => {
                dispatch({
                    type: ON_LOGIN_SUCCESS,
                    payload: res.data
                })
            })
            .catch((err) => {
                console.log(err.response)
                dispatch({
                    type: ON_LOGIN_FAIL,
                    payload: err.response.data.message
                })
            })
    }
}

export const cookieChecker = () => {
    return {
        type: "COOKIE_CHECK",
    };
};

export const userKeepLogin = (userData) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/users/${userData.id}`)
            .then((res) => {
                console.log(res.data)

                dispatch({
                    type: ON_LOGIN_SUCCESS,
                    payload: res.data
                })
            })
            .catch((err) => {
                console.log(err)

            })
    }
}

export const logOutHandler = () => {
    return {
        type: ON_LOGOUT,
    }
}

export const searchProduct = (search) => {
    return {
        type: "SEACRH_FILTER",
        payload: search
    };
}
