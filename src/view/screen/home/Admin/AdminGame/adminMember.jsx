import React from "react";
import "../AdminGame/adminGame.css"
import Axios from "axios";
import { API_URL } from "../../../../../redux/API";

class AdminMember extends React.Component {
    state = {
        memberList: [],
        editMember: {
            name: '',
            email: '',
            username: '',
            address:'',
            telp:0
        },
        currentPage: 0
    }

    componentDidMount() {
        this.getAllUser(this.state.currentPage)
    }


    inputHandler = (e, field) => {
        const { value } = e.target
        this.setState({
            editMember: {
                ...this.state.editMember,
                [field]: value
            }
        })
    }

    nextHandler = (e) => {
        this.getAllUser(this.state.currentPage + 1)
    }

    prevHandler = (e) => {
        this.getAllUser(this.state.currentPage - 1)
    }

    getAllUser = (currentPage) => {
        currentPage = currentPage
        Axios.get(`${API_URL}/users/user?page=${currentPage}&size=2`)
            .then((res) => {
                console.log(res.data.content)
                this.setState({ memberList: res.data.content })
                this.setState({ currentPage: res.data.number })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    saveEdit = () => {
        Axios.put(`${API_URL}/users/editProfile`, this.state.editMember)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err.data)
            })

    }

    deleteClick = (id) => {
        Axios.delete(`${API_URL}/users/${id}`)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderUser = () => {
        return this.state.memberList.map((val, idx) => {
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{val.name}</td>
                    <td>{val.username}</td>
                    <td>{val.email}</td>
                    <td>{val.address}</td>
                    <td>{val.telp}</td>
                    <td>
                        <input type="button" className="edit-btn" value="EDIT" onClick={() => { this.editClick(idx) }} />
                        <input type="button" className="delete-btn" value="DELETE" onClick={() => { this.deleteClick(val.id) }} /> </td>
                </tr>
            )
        })
    }

    editClick = (idx) => {
        this.setState({
            editMember: {
                ...this.state.memberList[idx]
            }
        })
    }

    render() {
        const { name, email, username } = this.state.editMember
        const { currentPage } = this.state
        const totalPage = this.state.memberList.length / 2
        return (
            <div className="container">
                <h1>LIST Member</h1>
                <table id="customers">
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Telp No</th>
                    </tr>
                    {this.renderUser()}
                </table>

                <input type="button" className="next-btn" value="Next" disabled ={currentPage === totalPage ? true : false} onClick={(e) => { this.nextHandler(e) }} />

                <input type="button" className="prev-btn" value="Previous" disabled ={currentPage === 0 ? true : false} onClick={(e) => { this.prevHandler(e) }} />


                <h1>EDIT USER</h1>
                <div className="product-form">
                    <div className="textbox">
                        <input type="text" value={name} placeholder="Name" onChange={(e) => this.inputHandler(e, "name")} />
                    </div>
                    <div className="textbox">
                        <input type="text" value={username} placeholder="Username" onChange={(e) => this.inputHandler(e, "username")} />
                    </div>
                    <div className="textbox">
                        <input type="text" value={email} placeholder="Email" onChange={(e) => this.inputHandler(e, "email")} />
                    </div>
                    <div className="textbox">
                        <input type="text" value={email} placeholder="Address" onChange={(e) => this.inputHandler(e, "addres")} />
                    </div>
                    <div className="textbox">
                        <input type="text" value={email} placeholder="Telephone Number" onChange={(e) => this.inputHandler(e, "telp")} />
                    </div>
                    <input type="button" className="save-btn" value="SAVE CHANGE" onClick={this.saveEdit} />

                </div>

            </div>
        )
    }
}

export default AdminMember