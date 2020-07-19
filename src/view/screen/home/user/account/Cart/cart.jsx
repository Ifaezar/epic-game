import React from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../../../../../../redux/API'
import Axios from 'axios'
import "./cart.css"
import { UncontrolledCollapse, card, cardBody } from 'reactstrap'
import swal from 'sweetalert'

class Cart extends React.Component {
    state = {
        cartList: [],
        chcekoutDate: new Date(),
        transactionList: {
            status: "pending"
        },
        transactionDetailLis: {
            edition: "basic"
        }
    }

    componentDidMount() {
        this.getAllCart()

    }

    getAllCart = () => {
        Axios.get(`${API_URL}/cart/${this.props.user.id}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ cartList: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    totalPriceCount = () => {
        let totalPrice = 0
        this.state.cartList.map((val) => {
            totalPrice += val.game.price * val.quantity
        })
        return totalPrice
    }

    confirmClick = () => {

        if (this.state.cartList[0].edition == "paket") {
            Axios.post(`${API_URL}/transaction/${this.props.user.id}/${this.state.cartList[0].paket.totalPrice}/${this.state.cartList[0].paket.id}`, this.state.transactionList, {
                params: {
                    checkoutTime: this.state.chcekoutDate.toLocaleDateString()
                }
            })
                .then((res) => {
                    swal("Success", "Add to Transaction", "success")
                    this.state.cartList.map((val => {
                        val.paket.paketDetail.map(value => {
                            Axios.post(`${API_URL}/transactionDetail/${res.data.id}/${value.game.id}`, this.state.transactionDetailLis, {
                                params: {
                                    priceProduct: value.game.price * val.quantity,
                                    quantity: val.quantity
                                }
                            })
                                .then((res) => {
                                    console.log(res.data)

                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        })
                        Axios.delete(`${API_URL}/cart/delete/${val.id}`)
                            .then((res) => {
                                console.log(res)
                                this.getAllCart()
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }))

                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            Axios.post(`${API_URL}/transaction/${this.props.user.id}/${this.totalPriceCount()}`, this.state.transactionList, {
                params: {
                    checkoutTime: this.state.chcekoutDate.toLocaleDateString()
                }
            })
                .then((res) => {
                    console.log(res.data.id)
                    this.state.cartList.map((val => {
                        console.log(val.id)
                        Axios.post(`${API_URL}/transactionDetail/${res.data.id}/${val.game.id}`, this.state.transactionDetailLis, {
                            params: {
                                priceProduct: val.game.price * val.quantity,
                                quantity: val.quantity
                            }
                        })
                            .then((res) => {
                                console.log(res.data)
                                Axios.delete(`${API_URL}/cart/delete/${val.id}`)
                                    .then((res) => {
                                        console.log(res)
                                        this.getAllCart()
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }))
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    deleteCart = (id, gameId) => {
        Axios.delete(`${API_URL}/cart/${id}/${gameId}`)
            .then((res) => {
                console.log(res)
                this.getAllCart()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        if (this.state.cartList == "") {
            return (
                <div className="container">
                    <p>Cart is Empty,
                    <a href="/browse"> Go Shopping</a>
                    </p>
                </div>
            )
        } else {
            return (
                <div className="bg-color">
                    <div className="container">
                        <table id="customers">
                            {this.state.cartList.map((val) => {
                                if (val.edition == "paket") {
                                    return (
                                        <div>
                                            <tr>
                                                <td>{val.paket.paketName}</td>
                                                <td>{" "}
                                                    {new Intl.NumberFormat("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }).format(val.paket.totalPrice)}{" "}</td>
                                            </tr>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <>
                                            <tr>
                                                <td><img src={val.game.picture} alt="" /></td>
                                                <td>{val.game.name}</td>
                                                <td>{val.edition}</td>
                                                <td>{val.quantity}</td>
                                                <td>{" "}
                                                    {new Intl.NumberFormat("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }).format(val.game.price)}{" "}</td>
                                                <td>
                                                    <input type="button" className="del-btn" onClick={() => { this.deleteCart(val.id, val.game.id) }} value="delete" />
                                                </td>
                                            </tr>
                                        </>
                                    )
                                }
                            })}
                        </table>
                        <input type="button" className="checkout-btn" value="CheckOut" id="toggler" />
                        {
                            < UncontrolledCollapse toggler="#toggler">
                                {
                                    this.state.cartList.map(val => {
                                        if (val.edition == "paket") {
                                            return (
                                                <>
                                                    <h1 style={{ color: "white" }}>{val.paket.paketName}</h1>
                                                    <h1 style={{ color: "white" }}>{" "}
                                                        {new Intl.NumberFormat("id-ID", {
                                                            style: "currency",
                                                            currency: "IDR",
                                                        }).format(val.paket.totalPrice)}{" "}</h1>
                                                    <table id="checkout">
                                                        <tr>
                                                            <td>Game Name</td>
                                                            <td>Game Price</td>

                                                        </tr>
                                                        {
                                                            val.paket.paketDetail.map(value => {
                                                                return (
                                                                    <tr>
                                                                        <td>{value.game.name}</td>
                                                                        <td>{" "}
                                                                            {new Intl.NumberFormat("id-ID", {
                                                                                style: "currency",
                                                                                currency: "IDR",
                                                                            }).format(value.game.price)}{" "}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </table>
                                                </>
                                            )
                                        } else {
                                            return (
                                                <card>
                                                    <cardBody>
                                                        <table id="checkout">
                                                            <tr>
                                                                <td>Game Name</td>
                                                                <td>Game Price</td>
                                                                <td>Quantity</td>
                                                                <td>Total Game Price</td>
                                                            </tr>
                                                            {
                                                                this.state.cartList.map(val => {
                                                                    return (
                                                                        <tr>
                                                                            <td>{val.game.name}</td>
                                                                            <td>{" "}
                                                                                {new Intl.NumberFormat("id-ID", {
                                                                                    style: "currency",
                                                                                    currency: "IDR",
                                                                                }).format(val.game.price)}{" "}</td>
                                                                            <td>{val.quantity}</td>
                                                                            <td>{" "}
                                                                                {new Intl.NumberFormat("id-ID", {
                                                                                    style: "currency",
                                                                                    currency: "IDR",
                                                                                }).format(val.game.price * val.quantity)}{" "}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </table >
                                                        <h1 className="cart"> Total Price = {" "}
                                                            {new Intl.NumberFormat("id-ID", {
                                                                style: "currency",
                                                                currency: "IDR",
                                                            }).format(this.totalPriceCount())}{" "}</h1>
                                                        <input type="button" className="checkout-btn" value="Confrim" onClick={() => this.confirmClick()} />
                                                    </cardBody >
                                                </card >
                                            )
                                        }
                                    })
                                }
                                <input type="button" className="checkout-btn" value="Confrim" onClick={() => this.confirmClick()} />
                            </UncontrolledCollapse>

                        }
                    </div >
                </div >
            )
        }
    }
}

const mapsStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapsStateToProps)(Cart)