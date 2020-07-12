import React from 'react'
import './history.css'
import Axios from 'axios'
import { API_URL } from '../../../../../../redux/API'

import { connect } from 'react-redux'

class History extends React.Component {
    state = {
        transaction: [],
        active: [],
    }

    componentDidMount() {
        this.getTransaction()
    }

    getTransaction = () => {
        Axios.get(`${API_URL}/transaction/history/${this.props.user.id}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ transaction: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderTransaction = () => {
        return this.state.transaction.map((val, idx) => {
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
                        <td>{val.status}</td>
                        <td>{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(val.total_price)}{" "}</td>
                    </tr>
                    <tr className={`collapse-item ${
                        this.state.active.includes(idx) ? "active" : null
                        }`}>
                        {val.transactionDetail.map((value) => {
                            return (

                                <td className="" colSpan={3}>
                                    <div className="d-flex align-items-center">
                                        <img src={value.game.picture} alt="" />
                                        <div className="d-flex flex-column ml-4 justify-content-center">
                                            <h5>{value.game.name}</h5>
                                            <h5>{new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(value.game.price)}{" "}</h5>
                                            <h5>{value.edition}</h5>
                                        </div>
                                    </div>
                                </td>
                            )
                        })
                        }
                    </tr>
                </>
            )
        })
    }

    render() {
        return (
            <div className="history-screen">
                <div className="container">
                    <h1>HISTORY</h1>
                    <table id="customers">
                        <tr>
                            <td>Status</td>
                            <td>Total Price</td>
                        </tr>
                        {this.renderTransaction()}
                    </table>

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

export default connect(mapsStateToProps)(History)
