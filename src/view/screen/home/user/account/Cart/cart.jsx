import React from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../../../../../../redux/API'
import Axios from 'axios'
import "./cart.css"


class Cart extends React.Component {
    state = {
        cartList: [],
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
            totalPrice += val.game.price
        })
        return totalPrice
    }

    checkoutClick = () => {
        Axios.post(`${API_URL}/transaction/${this.props.user.id}/${this.totalPriceCount()}`, this.state.transactionList)
            .then((res) => {
                console.log(res.data.id)
                this.state.cartList.map((val => {
                    console.log(val.id)
                    Axios.post(`${API_URL}/transactionDetail/${res.data.id}/${val.game.id}`, this.state.transactionDetailLis)
                        .then((res) => {
                            console.log(res.data)
                            this.deleteCart(val.id)
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

    deleteCart = (id) => {
        Axios.delete(`${API_URL}/cart/${id}`)
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
                                return (
                                    <>
                                        <tr>
                                            <td><img src={val.game.picture} alt="" /></td>
                                            <td>{val.game.name}</td>
                                            <td>{val.edition}</td>
                                            <td>{" "}
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(val.game.price)}{" "}</td>
                                            <td>
                                                <input type="button" className="del-btn" onClick={() => { this.deleteCart(val.id) }} value="delete" />
                                            </td>
                                        </tr>
                                    </>
                                )
                            })}
                        </table>
                        <h1 className="cart"> Total Price = {" "}
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(this.totalPriceCount())}{" "}</h1>
                        <input type="button" className="checkout-btn" onClick={() => { this.checkoutClick() }} value="CheckOut" />
                    </div>
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