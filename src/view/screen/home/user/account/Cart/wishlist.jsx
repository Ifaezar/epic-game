import React from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../../../../../../redux/API'
import Axios from 'axios'
import "./cart.css"
import swal from 'sweetalert'

class Wishlist extends React.Component {
    state = {
        wishlist: [],
        cart: {
            edition: "basic",
            quantity: 1
        },
    }
    componentDidMount() {
        this.getAllWishlist()

    }

    getAllWishlist = () => {
        Axios.get(`${API_URL}/wishlist/${this.props.user.id}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ wishlist: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    addTocart = (id, gameId) => {
        Axios.post(`${API_URL}/cart/addToCart/${this.props.user.id}/${gameId}`, this.state.cart)
            .then((res) => {
                console.log(res.data)
                Axios.delete(`${API_URL}/wishlist/delete/${id}`)
                .then((res) =>{
                    console.log(res.data)
                    this.getAllWishlist()
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    deleteWishlist = (id) =>{
        Axios.delete(`${API_URL}/wishlist/delete/${id}`)
        .then(res =>{
            console.log(res.data)
            swal("Success", "Delete From Wishlist", "success")
            this.getAllWishlist()

        })
        .catch(err =>{
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
                            {this.state.wishlist.map((val) => {
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
                                                <td>{" "}
                                                    {new Intl.NumberFormat("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }).format(val.game.price)}{" "}</td>
                                                <td>
                                                    <input type="button" style={{width:"60%"}} className="edit-btn" onClick={() => { this.addTocart(val.id, val.game.id) }} value="Add To Cart" />
                                                    <input type="button" style={{width:"60%"}} className="del-btn" onClick={() => { this.deleteWishlist(val.id) }} value="Delete Wishlist" />
                                                </td>
                                            </tr>
                                        </>
                                    )
                                }
                            })}
                        </table>
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
export default connect(mapsStateToProps)(Wishlist)