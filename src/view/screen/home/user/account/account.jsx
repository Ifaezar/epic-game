import React from 'react'
import "./account.css"
import { connect } from 'react-redux'
import Axios from 'axios'
import { API_URL } from '../../../../../redux/API'
import { loginHandler } from '../../../../../redux/action'

import { UncontrolledCollapse, card, cardBody } from 'reactstrap'


class Account extends React.Component {
    state = {
        selectedFile: null,
        editForm: {
            name: "",
            username: "",
            email: "",
            address: "",
            telp: 0
        },
        newPassword: ""
    }

    FileChangedHandler = (e) => {
        this.setState({ selectedFile: e.target.files[0] })
    }

    profilePictureHandler = () => {
        let formData = new FormData();
        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        Axios.post(`${API_URL}/users/profilePicture/${this.props.user.id}`, formData)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    inputHandler = (e, field) => {
        const { value } = e.target
        this.setState({
            editForm: {
                ...this.state.editForm,
                [field]: value
            }
        })
    }
    componentDidMount() {
        this.getUserProfile()
    }

    getUserProfile = () => {
        Axios.get(`${API_URL}/users/profile/${this.props.user.username}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ editForm: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }


    saveButton = () => {
        console.log(this.state.editForm)
        Axios.put(`${API_URL}/users/editProfile`, this.state.editForm)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err.data)
            })
    }


    render() {
        const { username, name, email, address, telp, picture } = this.state.editForm
        return (
            <div className="account-screen ">
                <div className="account-form container">
                    <div className="row">
                        <div className="col-6">
                            <h3>Account Info</h3>
                            <img src={picture} alt="" />
                            <div className="text-box">
                                <p className="text-detail ">Name : {name}</p>
                            </div>
                            <div className="text-box">
                                <p className="text-detail ">Email : {email}</p>
                            </div>
                            <div className="text-box">
                                <p className="text-detail ">Username : {username}</p>
                            </div>
                            <div className="text-box">
                                <p className="text-detail ">Address : {address} </p>
                            </div>
                            <div className="text-box">
                                <p className="text-detail ">Telephone Number : {telp} </p>
                            </div>
                            <div className="change">
                                <a href="/changePassword">Change Password</a>
                            </div>
                            <div className="mt-5">
                                {
                                    picture ? (
                                        <h3>  Edit Profile Picture</h3>
                                    ) : (
                                            <h3>  Add Profile Picture</h3>
                                        )
                                }

                                <input type="file" onChange={this.FileChangedHandler} />
                                <input type="button" className="account-btn" value="Upload" onClick={this.profilePictureHandler} />

                            </div>
                        </div>
                        <div className="col-6">
                            <input type="button" className="account-btn" value="Edit Profile" id="toggler" />
                            <UncontrolledCollapse toggler="#toggler">
                                <card>
                                    <cardBody>
                                        <p className="text-detail ">Name :</p>
                                        <div className="textbox">
                                            <input type="text" style={{ width: "100%" }} value={name} placeholder="Name" onChange={(e) => this.inputHandler(e, "name")} />
                                        </div>
                                        <p className="text-detail">Username :</p>
                                        <div className="textbox">
                                            <input type="text" style={{ width: "100%" }} value={username} placeholder="Username" onChange={(e) => this.inputHandler(e, "username")} />
                                        </div>
                                        <p className="text-detail">Email :</p>
                                        <div className="textbox">
                                            <input type="text" style={{ width: "100%" }} value={email} placeholder="Email" onChange={(e) => this.inputHandler(e, "email")} />
                                        </div>
                                        <p className="text-detail">Address :</p>
                                        <div className="textbox">
                                            <input type="text" style={{ width: "100%" }} value={address} placeholder="Address" onChange={(e) => this.inputHandler(e, "address")} />
                                        </div>
                                        <p className="text-detail">Telephone Number :</p>
                                        <div className="textbox">
                                            <input type="text" style={{ width: "100%" }} value={telp} placeholder="Telp No" onChange={(e) => this.inputHandler(e, "telp")} />
                                        </div>
                                        <div>
                                            <input type="button" value="SAVE CHANGES" className="account-btn" onClick={this.saveButton} />
                                        </div>
                                    </cardBody>
                                </card>
                            </UncontrolledCollapse>

                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

const mapsStateToProps = (state) => {
    return {
        user: state.user
    }
}
export default connect(mapsStateToProps)(Account)