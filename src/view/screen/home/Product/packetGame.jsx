import React from "react"
import Axios from "axios"
import { API_URL } from "../../../../redux/API"
import { connect } from 'react-redux'

class PacketGame extends React.Component {
    state = {
        packetGame: [],
        cart: {
            edition: "paket",
            quantity: 1
        }
    }

    componentDidMount() {
        this.getpaket()
    }

    totalPriceCount = () => {
        let totalPrice = 0
        this.state.packetGame.paketDetail.map((val) => {
            totalPrice += val.game.price
        })
        return totalPrice
    }

    getpaket = () => {
        Axios.get(`${API_URL}/paket/${this.props.match.params.id}`)
            .then((res) => {
                console.log(res.data.paketDetail)
                this.setState({ packetGame: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    addToCart = () => {
        Axios.post(`${API_URL}/cart/addPacketToCart/${this.props.user.id}/${this.props.match.params.id}`, this.state.cart)
        .then((res) =>{
            console.log(res.data)
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    renderPaket = () => {
        if (this.state.packetGame != "") {
            return (
                <div>
                    <div className="row">
                        <div className="col-4">
                            <h4 style={{ color: "white" }}>Packet Name : {this.state.packetGame.paketName}</h4>
                        </div>
                        <div className="col-4">
                            <h4 style={{ color: "white" }}> {
                                new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(this.state.packetGame.totalPrice)
                            }{" "}</h4>
                            <h4 style={{ color: "red", textDecoration: "line-through" }}>{
                                new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(this.totalPriceCount())
                            }{" "}</h4>
                        </div>
                    </div>
                    <div className="row">
                        {
                            this.state.packetGame.paketDetail.map(val => {
                                return (
                                    <div className="col-4">
                                        <div className="card">
                                            <img src={val.game.picture} alt="" />
                                            <h1>{val.game.name}</h1>
                                            <span>{val.game.developer}</span>
                                            {
                                                val.game.price == 0 ? (
                                                    <h2>FREE </h2>
                                                ) : (
                                                        <h2>
                                                            {" "}
                                                            {
                                                                new Intl.NumberFormat("id-ID", {
                                                                    style: "currency",
                                                                    currency: "IDR",
                                                                }).format(val.game.price)
                                                            }{" "}
                                                        </h2>
                                                    )
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <input className="game-btn" type="button" onClick={this.addToCart} value="Get" />
                    </div>
                </div>

            )
        }

    }

    render() {
        return (
            <div>
                <div className="product-screen">
                    <div className="container">

                        {this.renderPaket()}


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

export default connect(mapsStateToProps)(PacketGame)