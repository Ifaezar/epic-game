import React from 'react'
import "./browse.css"
import Axios from 'axios'
import { API_URL } from '../../../../redux/API'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";

class BrowsePacket extends React.Component {
    state = {
        packetGame: []
    }

    componentDidMount() {
        this.getAllPacketGame()
    }

    getAllPacketGame = () => {
        Axios.get(`${API_URL}/paket`)
            .then(res => {
                console.log(res.data)
                this.setState({ packetGame: res.data })
            })
            .catch(err => {
                console.log(err)
            })
    }

    renderPacketGame = () => {
        return (
            <div className="row">
                {this.state.packetGame.map(val => {
                    return (
                        <div className="col-3">
                            <Link
                                to={`/packetGame/${val.id}`}
                                style={{ textDecoration: "none" }}>

                                <div className="card col-3">
                                    <img src={val.image} alt="" />
                                    <h1>{val.paketName}</h1>
                                    {
                                        val.totalPrice == 0 ? (
                                            <h2>FREE </h2>
                                        ) : (
                                                <h2>
                                                    {" "}
                                                    {
                                                        new Intl.NumberFormat("id-ID", {
                                                            style: "currency",
                                                            currency: "IDR",
                                                        }).format(val.totalPrice)
                                                    }{" "}
                                                </h2>
                                            )
                                    }
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        return (
            <div className="bg-color">
                <div className="container bg-color">
                    {this.renderPacketGame()}
                </div>
            </div >


        )
    }
}

export default BrowsePacket