import userTypes from "../types/user"

const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT, ON_REGISTER_SUCCESS } = userTypes

const init_state = {
    id: 0,
    username: "",
    password: "",
    email: "",
    name: "",
    role: "",
    errMsg: "",
    search: "",
    cookieCheck: false
}

export default (state = init_state, action) => {
    switch (action.type) {
        case ON_LOGIN_SUCCESS:
            const { username, email, id, name, role, password } = action.payload
            return {
                ...state,
                username,
                password,
                email,
                id,
                name,
                role,
                errMsg: "",
                cookieCheck: true
            }
        case "COOKIE_CHECK":
            return { ...state, cookieCheck: true };
        case ON_LOGOUT:
            return { ...init_state, cookieCheck: true };
        case ON_LOGIN_FAIL:
            return { ...state, errMsg: action.payload, cookieCheck: true }
        case "SEACRH_FILTER":
            return { ...state, search: action.payload };
        default:
            return { ...state }
    }
}