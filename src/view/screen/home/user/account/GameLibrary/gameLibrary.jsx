import React from "react"
import './gameLibrary.css'
import { connect } from 'react-redux'
import Axios from "axios"
import { API_URL } from "../../../../../../redux/API"
import { Link } from 'react-router-dom'

class GameLibrary extends React.Component {

    state = {
        gameLibraryListt: []
    }

    componentDidMount() {
        this.getGameLibrary()
    }

    getGameLibrary = () => {
        Axios.get(`${API_URL}/gameLibrary/${this.props.user.id}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ gameLibraryListt: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }


    renderGameLibrary = () => {
        return this.state.gameLibraryListt.map(val => {
            return (
                <div className="col-4 card" >
                    <img src={val.game.picture} alt="" />
                    <h1>{val.game.name}</h1>
                    <span>Stok = {val.stock}</span>
                    <Link
                        to={`/sendGame/${val.id}`}
                        className="send-btn"
                        style={{ textDecoration: "none", color: " #fff" }}>
                        Send Game to Friend
                    </Link>
                </div>
            )
        })
    }

    render() {
        return (
            <div className="bg-color">
                <div className="container">
                    <h1 className="title">Game Library</h1>
                    <div className="row">
                        {this.renderGameLibrary()}

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

export default connect(mapsStateToProps)(GameLibrary)