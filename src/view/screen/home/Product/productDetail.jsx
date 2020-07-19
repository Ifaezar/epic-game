import React from "react";
import './productDetail.css';
import Axios from "axios";
import { API_URL } from "../../../../redux/API";
import { connect } from 'react-redux'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, } from "@fortawesome/free-solid-svg-icons";

class ProductDetail extends React.Component {
    state = {
        game: [],
        cart: {
            edition: "basic",
            quantity: 1
        },
        wishlist: {
            edition: "basic"
        }
    }

    componentDidMount() {
        this.getGameById()
    }

    getGameById = () => {
        Axios.get(`${API_URL}/game/${this.props.match.params.id}`, this.state.cart)
            .then((res) => {
                console.log(res.data)
                this.setState({ game: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    cartClick = (gameId) => {
        if (this.props.user.id == "") {
            swal("Failed", "Please login first", "error")
        } else {
            Axios.get(`${API_URL}/cart/${this.props.user.id}`)
                .then((res) => {
                    if (res.data.length == 0) {
                        Axios.post(`${API_URL}/cart/addToCart/${this.props.user.id}/${gameId}`, this.state.cart)
                            .then((res) => {
                                console.log(res.data)
                                this.getGameById()
                                swal("Success", "Add to Cart", "success")
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else {
                        res.data.map((val, idx) => {
                            if (gameId == val.game.id) {
                                Axios.put(`${API_URL}/cart/addToCartSameId/${this.props.user.id}/${gameId}/${val.id}`, this.state.cart)
                                    .then((res) => {
                                        console.log(res.data)
                                        this.getGameById()
                                        swal("Success", "Add to Cart", "success")
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            } else if ((idx + 1) == res.data.length) {
                                Axios.post(`${API_URL}/cart/addToCart/${this.props.user.id}/${gameId}`, this.state.cart)
                                    .then((res) => {
                                        console.log(res.data)
                                        this.getGameById()
                                        swal("Success", "Add to Cart", "success")
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }
                        })

                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }

    }

    wishlistClick = (gameId) => {
        if (this.props.user.id == "") {
            swal("Failed", "Please login first", "error")
        } else {
            Axios.post(`${API_URL}/wishlist/addTowishlist/${this.props.user.id}/${gameId}`, this.state.wishlist)
                .then((res) => {
                    console.log(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })

        }
    }

    render() {
        const { game } = this.state
        return (
            <div className="product-screen">
                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            <img src={game.picture} alt="" />
                        </div>
                        <div className="col-4">
                            <span>{game.description}</span>
                        </div>
                        <div className="col-4">
                            <div>
                                <span>stok : {game.stokUser}</span>
                            </div>
                            <div>
                                {
                                    game.price == 0 ? (
                                        <span>FREE</span>
                                    ) : (
                                            <span>{" "}
                                                {
                                                    new Intl.NumberFormat("id-ID", {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }).format(game.price)
                                                }{" "}</span>
                                        )
                                }

                            </div>
                            <div>
                                {
                                    game.stokUser <= 0 ? (
                                        <span>Mohon Maaf Stok Game Habis</span>
                                    ) : (
                                            <input className="game-btn" type="button" onClick={() => { this.cartClick(game.id) }} value="Get" />
                                        )
                                }

                            </div>
                            <div className="font-product mt-3">
                                <a onClick={() => { this.wishlistClick(game.id) }}>
                                    <FontAwesomeIcon
                                        className="font-product mt-3"
                                        icon={faHeart}
                                    >
                                    </FontAwesomeIcon>
                                </a>
                                <span className="wishlist">Add To Wishlist</span>

                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <span>About Game</span>

                        </div>
                        <div className="col-4">
                            <span>{game.developer}</span>

                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
const mapsStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapsStateToProps)(ProductDetail)