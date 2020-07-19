import React from "react";
import "../AdminGame/adminGame.css"
import Axios from "axios";
import { API_URL } from "../../../../../redux/API";
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

class AdminPayment extends React.Component {
    state = {
        transactionList: [],
        active: [],
        modalOpen: false,
        transactionId: 0,
        image: '',
        acceptDate: new Date(),
        index: 0,
        gameLibrary: {
            edition: "basic"
        },
        statusAcc: "Accept",
        statusPending: "pending"

    }

    toggleHandler = (e, id, buktiTransfer, idx) => {
        this.setState({ modalOpen: true })
        this.setState({ image: buktiTransfer })
        this.setState({ transactionId: id })
        this.setState({ index: idx })

    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    }

    componentDidMount() {
        this.getAllTransaction()
    }

    getAllTransactionAccept = () => {
        Axios.get(`${API_URL}/transaction?name=${this.state.statusAcc}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ transactionList: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getAllTransaction = () => {
        Axios.get(`${API_URL}/transaction?name=${this.state.statusPending}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ transactionList: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }


    rejectHandler = () => {
        Axios.put(`${API_URL}/transaction/reject/${this.state.transactionId}`)
            .then((res) => {
                console.log(res.data)
                this.toggleModal()
                this.getAllTransaction()
            })
            .catch((err) => {
                console.log(err)
                console.log(this.state.transactionId)
            })
    }

    acceptHandler = () => {
        Axios.put(`${API_URL}/transaction/accept/${this.state.transactionId}?acceptTime=${this.state.acceptDate.toLocaleDateString()}`)
            .then((res) => {
                console.log(res.data)
                this.toggleModal()
                this.getAllTransaction()
                this.state.transactionList[this.state.index].transactionDetail.map(val => {
                    Axios.post(`${API_URL}/gameLibrary/add/${this.state.transactionId}/${val.game.id}/${val.quantity}`, this.state.gameLibrary)
                        .then((res) => {
                            console.log(res.data)
                            this.getAllTransactionAccept()
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderTransaction = () => {
        return this.state.transactionList.map((val, idx) => {
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
                        <td>{val.user.username}</td>
                        <td>{new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(val.total_price)}{" "}</td>
                        <td>{val.status}</td>
                        <td>{val.checkoutTime}</td>
                        <td>{val.acceptTime}</td>
                        <td><input type="button" onClick={(e) => this.toggleHandler(e, val.id, val.buktiTransfer, idx)} value="Lihat Bukti Transfer" /></td>
                    </tr>
                    {val.transactionDetail.map((value) => {
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
                            </tr>
                        )
                    })
                    }
                    <Modal
                        toggle={this.toggleModal}
                        isOpen={this.state.modalOpen}>
                        <ModalHeader toggle={this.toggleModal}>
                            <caption>
                                <h3>Bukti Transfer</h3>
                            </caption>
                        </ModalHeader>
                        <ModalBody>
                            <div>
                                <img src={this.state.image} alt="" />
                            </div>
                            <div>
                                {
                                    this.state.transactionList[this.state.index].status == "Accept" ? (
                                        <h4>Proses transaksi selesai</h4>
                                    ) : (
                                            <>
                                                <input type="button" onClick={this.acceptHandler} className="upload-btn" value="Accept" />
                                                <br></br>
                                                <br></br>
                                                <input type="button" onClick={this.rejectHandler} className="reject-btn" value="Reject" />
                                            </>
                                        )
                                }
                            </div>
                            <br />
                            <input type="button" onClick={this.toggleModal} className="upload-btn" value="Cancel" />
                        </ModalBody>
                    </Modal>
                </>
            )

        })
    }

    render() {
        return (
            <div className="container">
                <h1>Payment List</h1>
                <div className="container row ">
                    <div className="col-6 status">
                        <input type="button" onClick={this.getAllTransaction} className="status-btn" value="Pending"/>
                       
                    </div>
                    <div className="col-6">
                    <input type="button" onClick={this.getAllTransactionAccept} className="status-btn" value="Accept"/>
                    </div>
                </div>
                <table id="customers">
                    <tr>
                        <td>No</td>
                        <td>Username</td>
                        <td>Total Price</td>
                        <td>Status</td>
                        <td>Checkout Date</td>
                        <td>Confirm Date</td>
                        <td>Bukti Transfer</td>
                    </tr>
                    {this.renderTransaction()}
                </table>

            </div>
        )
    }
}

export default AdminPayment