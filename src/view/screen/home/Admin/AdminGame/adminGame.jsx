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
            stokAdmin: 0

        },
        editGame: {
            name: "",
            description: "",
            developer: "",
            price: 0,
            picture: "",
            stokAdmin: 0

        },
        addCategory: "",
        category: [],
        currentPage: 0,
        stolAwal: 0
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
                    <td>{val.stokAdmin}</td>
                    <td>{val.category.map((value) => {
                        return (
                            <>
                                <ul>
                                    {value.categoryName}
                                    <FontAwesomeIcon
                                        className="ml-3"
                                        icon={faTimes}
                                        onClick={() => { this.deleteCategoryGame(idx, value.id) }}
                                        style={{ color: "#fff", fontSize: "20px" }}>
                                    </FontAwesomeIcon>
                                </ul>
                            </>
                        )
                    })}</td>
                    <td>
                        <input type="button" className="edit-btn" value="EDIT" onClick={() => { this.editGameHandler(idx, val.stokAdmin) }} />
                        <input type="button" className="delete-btn" value="DELETE" onClick={() => { this.deleteGameClick(val.id) }} /> </td>
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
                        this.getAllGame()
                        this.renderGame()
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

    editGameHandler = (idx, stok) => {
        this.setState({
            editGame: {
                ...this.state.productGame[idx]
            },
            stolAwal: stok
        })
    }

    editGameClick = () => {
        Axios.put(`${API_URL}/game/edit/${this.state.stolAwal}`, this.state.editGame)
            .then((res) => {
                console.log(res.data)
                if (this.state.addCategory != "") {
                    Axios.post(`${API_URL}/game/${res.data.id}/categoryName/${this.state.addCategory}`)
                        .then((res) => {
                            console.log(res.data)
                            this.getAllGame()
                            this.renderGame()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    deleteGameClick = (idx) => {
        Axios.delete(`${API_URL}/game/${idx}`)
            .then((res) => {
                console.log(res)
                this.getAllGame()
                this.renderGame()
            })
            .catch((err) => {
                console.log(err)
            })

    }

    deleteCategoryGame = (gameId, categoryId) => {
        Axios.delete(`${API_URL}/game/${gameId + 1}/delete/${categoryId}`)
            .then((res) => {
                console.log(res.data)
                this.getAllGame()
                this.renderGame()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        const { name, developer, price, picture, description, stokUser, stokAdmin } = this.state.editGame
        const { currentPage } = this.state
        const totalPage = this.state.productGame.length / 3
        return (
            <div>
                <h1>LIST GAME</h1>
                <div className="row">
                    <div className="col-8">
                        <table id="customers">
                            <tr>
                                <th>no</th>
                                <th>Game Name</th>
                                <th>Developer</th>
                                <th>Price</th>
                                <th>Picture</th>
                                <th>Stok</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                            {this.renderGame()}

                        </table>
                        <input type="button" className="prev-btn" value="First Page" onClick={() => { this.getAllGame(0) }} />
                        <input type="button" className="next-btn" value="Previous" disabled={currentPage === 0 ? true : false} onClick={(e) => { this.prevHandler(e) }} />
                        <input type="button" className="prev-btn" value="Next" disabled={currentPage === totalPage + 1 ? true : false} onClick={(e) => { this.nextHandler(e) }} />
                        <input type="button" className="next-btn" value="Last Page" onClick={() => { this.getAllGame(totalPage + 1) }} />
                    </div>
                    <div className="col-4">
                            <div>
                                <input type="button" style={{ width: "50%" }} className="prev-btn" value="ADD GAME" id="toggler" />
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
                                                    <input type="text" placeholder="Stok" onChange={(e) => this.inputHandler(e, "stokAdmin", "addGame")} />
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
                                <input type="button" style={{ width: "50%" }} className="prev-btn" value="EDIT GAME" id="toggler2" />
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
                                                    <input type="text" placeholder="Stok" onChange={(e) => this.inputHandler(e, "stokAdmin", "editGame")} />
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
                </div>



            </div>
        )
    }
}

export default AdminGame