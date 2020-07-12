import React from "react";
import './productDetail.css';
import Axios from "axios";
import { API_URL } from "../../../../redux/API";
import { connect } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, } from "@fortawesome/free-solid-svg-icons";

class ProductDetail extends React.Component {
    state = {
        game: [],
        cart: {
            edition: "basic"
        }
    }

    componentDidMount() {
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
        Axios.post(`${API_URL}/cart/addToCart/${this.props.user.id}/${gameId}`, this.state.cart)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
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
                                <input className="game-btn" type="button" onClick={() => { this.cartClick(game.id) }} value="Get" />
                            </div>
                            <div  className="font-product mt-3">
                                <a>
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
            </div>
        )
    }
}
const mapsStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapsStateToProps)(ProductDetail)