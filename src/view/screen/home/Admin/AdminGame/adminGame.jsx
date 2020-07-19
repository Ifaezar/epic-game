import React from "react";
import "../AdminGame/adminGame.css"
import Axios from "axios";
import { API_URL } from "../../../../../redux/API";
import Select from "react-select"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { UncontrolledCollapse, card, cardBody } from 'reactstrap'
import swal from 'sweetalert'

class AdminGame extends React.Component {
    state = {
        productGame: [],
        active: [],
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
        editPacket: {
            paketName: "",
            stock: "",
            image: "",
            totalPrice: 0,
        },
        gamePacket: {
            paketName: '',
            stock: 0,
            image: '',
            totalPrice: 0
        },
        packetList: [],
        paketDetail: {
            edition: "basic"
        },
        addCategory: "",
        category: [],
        currentPage: 0,
        stolAwal: 0,
        addPacketGame: []
    }

    categoryHandler = (e, field) => {
        const { value } = e.target
        this.setState({ addCategory: value })
    }

    gameNameHandler = (e) => {
        const { value } = e.target
        this.setState({ addPacketGame: [...this.state.addPacketGame, value] })
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
        Axios.get(`${API_URL}/game/gamesPage?page=${currentPage}&size=5`)
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

    renderGamePacket = () => {
        return this.state.packetList.map((val, idx) => {
            return (
                <>
                    <tr
                        onClick={() => {
                            if (this.state.active.includes(idx)) {
                                this.setState({
                                    active: [
                                        ...this.state.active.filter((item) => item !== idx),
                                    ],
                                });
                            } else {
                                this.setState({
                                    active: [...this.state.active, idx],
                                });
                            }
                        }}
                    >
                        <td>{idx + 1}</td>
                        <td>{val.paketName}</td>
                        <td>
                            {" "}
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(val.totalPrice)}{" "}</td>
                        <td>{val.stock}</td>
                        <td>
                            <input type="button" className="delete-btn" value="DELETE" onClick={() => { this.deletePaketClick(val.id) }} /> </td>
                    </tr>
                    {
                        val.paketDetail.map(value => {
                            return (
                                <tr className={`collapse-item ${
                                    this.state.active.includes(idx) ? "active" : null
                                    }`}>
                                    <td className="" colSpan={3}>
                                        <div className="d-flex align-items-center">
                                            <img src={value.game.picture} alt="" />
                                            <div className="d-flex flex-column ml-4 justify-content-center">
                                                <h5>{value.game.name}</h5>
                                                <h5>{new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(value.game.price)}{" "}</h5>
                                                <h5>{value.quantity}</h5>
                                                <h5>{value.priceProduct}</h5>
                                                <h5>{value.edition}</h5>
                                            </div>
                                        </div>
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            )
                        })
                    }
                </>
            )
        })
    }

    deletePaketClick = (id) => {
        Axios.delete(`${API_URL}/paket/${id}`)
            .then(res => {
                this.getAllPacket()
                this.renderGamePacket()
                swal("Success", "Delete Game", "success")
            })
            .catch(err => {
                console.log(err)
            })
    }

    addGameButton = () => {
        Axios.post(`${API_URL}/game`, this.state.addGame)
            .then((res) => {
                console.log(res.data)
                Axios.post(`${API_URL}/game/${res.data.id}/categoryName/${this.state.addCategory}`)
                    .then((res) => {
                        console.log(res.data)
                        swal("Success", "Add Game", "success")
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

    gameNameOption = () => {
        return (
            <select
                className="custom-text-input h-100 pl-3"
                onChange={(e) => this.gameNameHandler(e)}
            >
                <option value="" selected disabled hidden>Choose Category Game</option>
                {
                    this.state.productGame.map(val => {
                        return (
                            <option value={val.id}>{val.name}</option>
                        )
                    })
                }
            </select>
        )
    }

    componentDidMount() {
        this.getAllGame(this.state.currentPage)
        this.getAllCategory()
        this.getAllPacket()
        this.renderGame()
    }

    getAllPacket = () => {
        Axios.get(`${API_URL}/paket`)
            .then((res => {
                this.setState({ packetList: res.data })
                console.log(res.data)
            }))
            .catch((err) => {
                console.log(err)
            })
    }

    editGameHandler = (idx, stok) => {
        this.setState({
            editGame: {
                ...this.state.productGame[idx]
            },
            stolAwal: stok
        })
    }

    editPaketHandler = (idx) => {
        this.setState({
            editPacket: {
                ...this.state.packetList[idx]
            }
        })
    }

    editGameClick = () => {
        Axios.put(`${API_URL}/game/edit/${this.state.stolAwal}`, this.state.editGame)
            .then((res) => {
                console.log(res.data)
                this.getAllGame()
                this.renderGame()
                swal("Success", "Edit Game", "success")
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
                swal("Success", "Delete Game", "success")
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
                swal("Success", "Delete Category Game", "success")
                this.getAllGame()
                this.renderGame()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    addPaketGame = () => {
        Axios.post(`${API_URL}/paket`, this.state.gamePacket)
            .then(res => {
                console.log(res.data)
                this.state.addPacketGame.map(val => {
                    Axios.post(`${API_URL}/paketDetail/${res.data.id}/${val}`, this.state.paketDetail)
                        .then((res) => {
                            console.log(res.data)
                            this.getAllPacket()
                            this.renderGamePacket()
                            swal("Success", "Add Packet", "success")
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
            })
            .catch(err => {
                console.log(err)
            })
    }




    render() {
        const { name, developer, price, picture, description, stokUser, stokAdmin } = this.state.editGame
        const { currentPage } = this.state
        const totalPage = this.state.productGame.length / 5
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
                        <div className="container">
                            <input type="button" className="prev-btn mr-5" value="First Page" onClick={() => { this.getAllGame(0) }} />
                            <input type="button" className="next-btn mr-5" value="Previous" disabled={currentPage === 0 ? true : false} onClick={(e) => { this.prevHandler(e) }} />
                            <input type="button" className="prev-btn mr-5" value="Next" disabled={currentPage === totalPage ? true : false} onClick={(e) => { this.nextHandler(e) }} />
                            <input type="button" className="next-btn mr-5" value="Last Page" onClick={() => { this.getAllGame(totalPage + 1) }} />
                        </div>
                        <h1>page {this.state.currentPage + 1}</h1>
                        <div>
                            <h1>LIST PACKET GAME</h1>
                            <table id="customers">
                                <tr>
                                    <th>no</th>
                                    <th>Packet Name</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>
                                {this.renderGamePacket()}
                            </table>
                        </div>
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
                        <div>
                            <input type="button" style={{ width: "50%" }} className="prev-btn" value="ADD PACKET GAME" id="toggler3" />
                            <UncontrolledCollapse toggler="#toggler3">
                                <card>
                                    <cardBody>
                                        <div className="product-form">
                                            <div className="textbox">
                                                <input type="text" placeholder="Packet Name" onChange={(e) => this.inputHandler(e, "paketName", "gamePacket")} />
                                            </div>
                                            <div className="textbox">
                                                <input type="text" placeholder="Stok" onChange={(e) => this.inputHandler(e, "stock", "gamePacket")} />
                                            </div>
                                            <div className="textbox">
                                                <input type="text" placeholder="Price" onChange={(e) => this.inputHandler(e, "totalPrice", "gamePacket")} />
                                            </div>
                                            <div className="textbox">
                                                <input type="text" placeholder="Image" onChange={(e) => this.inputHandler(e, "image", "gamePacket")} />
                                            </div>
                                            <div className="textbox">
                                                {this.gameNameOption()}
                                            </div>
                                            <h1 style={{ color: "white" }}> Game ID :
                                            {
                                                    this.state.addPacketGame.map(val => {
                                                        return (
                                                            <h1 style={{ color: "white" }}>{val}</h1>
                                                        )
                                                    })
                                                }
                                            </h1>
                                            <input type="button" className="save-btn" value="SAVE GAME" onClick={this.addPaketGame} />
                                        </div>
                                    </cardBody>
                                </card>
                            </UncontrolledCollapse>
                        </div>
                    </div>
                </div>
                <h1>{this.state.editPacket.paketName}</h1>
            </div>
        )
    }
}

export default AdminGame