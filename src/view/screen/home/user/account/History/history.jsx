import React from 'react'
import './history.css'
import Axios from 'axios'
import { API_URL } from '../../../../../../redux/API'
import { connect } from 'react-redux'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

class History extends React.Component {
    state = {
        transaction: [],
        active: [],
        modalOpen: false,
        selectedFile: null,
        transactionId: 0
    }

    componentDidMount() {
        this.getTransaction()
    }

    uploadHanlder = (e, id) => {
        this.setState({ modalOpen: true })
        this.setState({ transactionId: id })

    }

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    }

    FileChangedHandler = (e) => {
        this.setState({ selectedFile: e.target.files[0] })
    }

    uploadBuktiTrasfer = () => {

        let formData = new FormData();
        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        console.log(this.state.selectedFile.name)

        Axios.post(`${API_URL}/transaction/uploadBuktiTransfer/${this.state.transactionId}`, formData)
            .then((res) => {
                console.log(res.data);
                this.toggleModal()
                this.getTransaction()
            })
            .catch((err) => {
                console.log(err);
            });
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
                        {
                            val.buktiTransfer ? (
                                val.status == "Accept" ? (
                                    <td>Terima Kasih Sudah Membeli</td>
                                ) : (
                                        <td>Bukti Transfer sudah diupload, mohon tunggu respon dari Admin</td>
                                    )

                            ) : (
                                    <td><input type="button" onClick={(e) => this.uploadHanlder(e, val.id)} className="upload-btn" value="Upload Foto" /></td>
                                )
                        }

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
                                            <h5>{value.edition}</h5>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                    }
                </>
            )
        })
    }

    render() {
        return (
            <div className="history-screen">
                <div className="container">
                    <h1 style={{color:"#fff"}}>HISTORY</h1>
                    <table id="customers">
                        <tr>
                            <td>Status</td>
                            <td>Total Price</td>
                            <td>Upload Bukti Transfer</td>
                        </tr>
                        {this.renderTransaction()}
                    </table>
                    <Modal
                        toggle={this.toggleModal}
                        isOpen={this.state.modalOpen}>
                        <ModalHeader toggle={this.toggleModal}>
                            <caption>
                                <h3>Upload Bukti Transfer</h3>
                            </caption>
                        </ModalHeader>
                        <ModalBody>
                            <input type="file" onChange={this.FileChangedHandler} />
                            <input type="button" onClick={this.uploadBuktiTrasfer} className="upload-btn" value="Upload" />
                            <br />
                            <br />
                            <input type="button" onClick={this.toggleModal} className="upload-btn" value="Cancel" />
                        </ModalBody>
                    </Modal>
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
