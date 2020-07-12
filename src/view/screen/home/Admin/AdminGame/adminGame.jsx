import React from "react";
import "../AdminGame/adminGame.css"
import Axios from "axios";
import { API_URL } from "../../../../../redux/API";
import Select from "react-select"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { UncontrolledCollapse, card, cardBody } from 'reactstrap'

class AdminGame extends React.Component {
    state = {
        productGame: [],
        addGame: {
            name: "",
            description: "",
            developer: "",
            price: 0,
            picture: "",

        },
        editGame: {
            name: "",
            description: "",
            developer: "",
            price: 0,
            picture: "",

        },
        addCategory: "",
        category: [],
        currentPage: 0
    }

    categoryHandler = (e, field) => {
        const { value } = e.target
        this.setState({ addCategory: value })
    }

    nextHandler = (e) => {
        this.getAllGame(this.state.currentPage + 1)
    }

    prevHandler = (e) => {
        this.getAllGame(this.state.currentPage - 1)
    }

    inputHandler = (e, field, form) => {
        const { value } = e.target
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value
            }
        })
    }


    addGame = () => {
        Axios.post(`${API_URL}/game`, this.state.addGame)
            .then((res) => {
                console.log(res.data)
                this.renderGame()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getAllCategory = () => {
        Axios.get(`${API_URL}/category`)
            .then((res) => {
                this.setState({ category: res.data })

            })
            .catch((err) => {
                console.log(err)
            })
    }

    getAllGame = (currentPage) => {
        currentPage = currentPage
        Axios.get(`${API_URL}/game/gamesPage?page=${currentPage}&size=3`)
            .then((res) => {
                this.setState({ productGame: res.data.content })
                console.log(res.data.content)
                this.setState({ currentPage: res.data.number })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderGame = () => {
        return this.state.productGame.map((val, idx) => {
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{val.name}</td>
                    <td>{val.developer}</td>
                    <td>
                        {" "}
                        {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(val.price)}{" "}</td>
                    <td><img src={val.picture} alt="" /></td>
                    <td>{val.category.map((value) => {
                        return (
                            <>
                                <ul>
                                    {value.categoryName}
                                    <FontAwesomeIcon
                                        className="ml-3"
                                        icon={faTimes}
                                        onClick={() => { this.deleteCategoryGame(idx, value.id) }}
                                        style={{ color: "#2b2b2b", fontSize: "20px" }}>
                                    </FontAwesomeIcon>
                                </ul>
                            </>
                        )
                    })}</td>
                    <td>
                        <input type="button" className="edit-btn" value="EDIT" onClick={() => { this.editGameHandler(idx) }} />
                        <input type="button" className="delete-btn" value="DELETE" onClick={() => { this.deleteGameClick(idx) }} /> </td>
                </tr>
            )
        })
    }

    addGameButton = () => {
        Axios.post(`${API_URL}/game`, this.state.addGame)
            .then((res) => {
                console.log(res.data)
                Axios.post(`${API_URL}/game/${res.data.id}/categoryName/${this.state.addCategory}`)
                    .then((res) => {
                        console.log(res.data)
                    })

                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    categoryOption = () => {

        return (
            <select
                className="custom-text-input h-100 pl-3"
                onChange={(e) => this.categoryHandler(e, "category")}
            >
                <option value="" selected disabled hidden>Choose Category Game</option>
                {
                    this.state.category.map(val => {
                        return (
                            <option value={val.categoryName}>{val.categoryName}</option>
                        )
                    })
                }
            </select>
        )
    }

    componentDidMount() {
        this.getAllGame(this.state.currentPage)
        this.getAllCategory()
        this.renderGame()
    }

    editGameHandler = (idx) => {
        this.setState({
            editGame: {
                ...this.state.productGame[idx]
            }
        })
    }

    editGameClick = () => {
        Axios.put(`${API_URL}/game/edit`, this.state.editGame)
            .then((res) => {
                console.log(res.data)
                Axios.post(`${API_URL}/game/${res.data.id}/categoryName/${this.state.addCategory}`)
                    .then((res) => {
                        console.log(res.data)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    deleteGameClick = (idx) => {
        Axios.delete(`${API_URL}/game/${idx + 1}`)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })

    }

    deleteCategoryGame = (gameId, categoryId) => {
        Axios.delete(`${API_URL}/game/${gameId + 1}/delete/${categoryId}`)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        const { name, developer, price, picture, description } = this.state.editGame
        const { currentPage } = this.state
        const totalPage = this.state.productGame.length / 3
        return (
            <div className="container">
                <h1>LIST GAME</h1>
                <table id="customers">
                    <tr>
                        <th>no</th>
                        <th>Game Name</th>
                        <th>Developer</th>
                        <th>Price</th>
                        <th>Picture</th>
                        <th>Category</th>
                    </tr>
                    {this.renderGame()}

                </table>
                <input type="button" className="prev-btn" value="First Page" onClick={() => { this.getAllGame(0) }} />
                <input type="button" className="next-btn" value="Next" disabled={currentPage === totalPage ? true : false} onClick={(e) => { this.nextHandler(e) }} />
                <input type="button" className="prev-btn" value="Previous" disabled={currentPage === 0 ? true : false} onClick={(e) => { this.prevHandler(e) }} />
                <input type="button" className="next-btn" value="Last Page" onClick={() => { this.getAllGame(totalPage) }} />
                <div>
                    <input type="button" className="prev-btn" value="ADD GAME" id="toggler" />
                    <UncontrolledCollapse toggler="#toggler">
                        <card>
                            <cardBody>
                                <div className="product-form">
                                    <div className="textbox">
                                        <input type="text" placeholder="Game Name" onChange={(e) => this.inputHandler(e, "name", "addGame")} />
                                    </div>
                                    <div className="textbox">
                                        <input type="text" placeholder="Developer" onChange={(e) => this.inputHandler(e, "developer", "addGame")} />
                                    </div>
                                    <div className="textbox">
                                        <input type="text" placeholder="Price" onChange={(e) => this.inputHandler(e, "price", "addGame")} />
                                    </div>
                                    <div className="textbox">
                                        <input type="text" placeholder="Picture" onChange={(e) => this.inputHandler(e, "picture", "addGame")} />
                                    </div>
                                    <div className="textbox">
                                        <input type="text" placeholder="Description" onChange={(e) => this.inputHandler(e, "description", "addGame")} />
                                    </div>
                                    <div className="textbox">
                                        <input type="date"  />
                                    </div>
                                    <div className="textbox">
                                        {this.categoryOption()}
                                    </div>
                                    <input type="button" className="save-btn" value="ADD GAME" onClick={this.addGameButton} />
                                    <h1>{this.state.addCategory}</h1>
                                </div>
                            </cardBody>
                        </card>
                    </UncontrolledCollapse>
                </div>

                <div>
                    <input type="button" className="prev-btn" value="EDIT GAME" id="toggler2" />
                    <UncontrolledCollapse toggler="#toggler2">
                        <card>
                            <cardBody>
                                <div className="product-form">
                                    <div className="textbox">
                                        <input type="text" value={name} placeholder="Name" onChange={(e) => this.inputHandler(e, "name", "editGame")} />
                                    </div>
                                    <div className="textbox">
                                        <input type="text" value={developer} placeholder="Developer" onChange={(e) => this.inputHandler(e, "developer", "editGame")} />
                                    </div>
                                    <div className="textbox">
                                        <input type="text" value={price} placeholder="Price" onChange={(e) => this.inputHandler(e, "price", "editGame")} />
                                    </div>
                                    <div className="textbox">
                                        <input type="text" value={picture} placeholder="Picture" onChange={(e) => this.inputHandler(e, "picture", "editGame")} />
                                    </div>
                                    <div className="textbox">
                                        <input type="text" value={description} placeholder="Description" onChange={(e) => this.inputHandler(e, "description", "editGame")} />
                                    </div>
                                    <div className="textbox">
                                        {this.categoryOption()}
                                    </div>
                                    <input type="button" className="save-btn" value="SAVE GAME" onClick={this.editGameClick} />
                                </div>
                            </cardBody>
                        </card>
                    </UncontrolledCollapse>
                </div>
            </div>
        )
    }
}

export default AdminGame