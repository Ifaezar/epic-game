import React from 'react'
import "./browse.css"
import Axios from 'axios'
import { API_URL } from '../../../../redux/API'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from "@fortawesome/free-solid-svg-icons";

class Browse extends React.Component {
    state = {
        productGame: [],
        category: [],
        categoryNow: "ALL",
        sortBy: "ALL",
        orderBy: 0,
        currentPage: 0,
        search: ""

    }

    nextHandler = (e) => {
        if (this.state.categoryNow == "ALL" && this.state.sortBy == "ALL") {
            this.getAllGame(this.state.currentPage + 1)
        } else if (this.state.categoryNow != "ALL") {
            this.showGameByCategory(this.state.currentPage + 1)
        } else {
            this.showSortGame(this.state.currentPage + 1)
        }
    }

    prevHandler = (e) => {
        if (this.state.categoryNow == "ALL" && this.state.sortBy == "ALL") {
            this.getAllGame(this.state.currentPage - 1)
        } else if (this.state.categoryNow != "ALL") {
            this.showGameByCategory(this.state.currentPage - 1)
        } else {
            this.showSortGame(this.state.currentPage - 1)
        }
    }

    orderByHandler = (e) => {
        const { value } = e.target
        this.setState({ orderBy: value })
    }

    componentDidMount() {
        this.getAllGame(this.state.currentPage)
        this.getAllCategory()
    }


    categoryHandler = (e) => {
        const { value } = e.target
        this.setState({ categoryNow: value })
    }

    sortHandler = (e) => {
        const { value } = e.target
        this.setState({ sortBy: value })
    }

    getAllCategory = () => {
        Axios.get(`${API_URL}/category`)
            .then((res) => {
                this.setState({ category: res.data })

            })
            .catch((err) => {
                console.log(err)
            })
    }

    findGame = () => {
        Axios.get(`${API_URL}/game/custom`, {
            params: {
                name: this.props.user.search
            }
        })
            .then((res) => {
                this.setState({ productGame: res.data })
                console.log(res.data)

            })
            .catch((err) => {
                console.log(err)
            })
    }

    getAllGame = (currentPage) => {
        Axios.get(`${API_URL}/game/gamesPage?page=${currentPage}&size=3`)
            .then((res) => {
                this.setState({ productGame: res.data.content })
                console.log(res.data)
                this.setState({ currentPage: res.data.number })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderGame = () => {
        return (
            <div className="row">
                {this.state.productGame.map(val => {
                    return (
                        <div className="col-3">
                            <Link
                                to={`/product/${val.id}`}
                                style={{ textDecoration: "none" }}>

                                <div className="card col-3">
                                    <img src={val.picture} alt="" />
                                    <h1>{val.name}</h1>
                                    <span>{val.developer}</span>
                                    {
                                        val.price == 0 ? (
                                            <h2>FREE </h2>
                                        ) : (
                                                <h2>
                                                    {" "}
                                                    {
                                                        new Intl.NumberFormat("id-ID", {
                                                            style: "currency",
                                                            currency: "IDR",
                                                        }).format(val.price)
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

    renderCategory = () => {
        return (
            <select
                className="custom-text-input h-100 pl-3 select-option"
                onChange={(e) => this.categoryHandler(e)}
                onClick={(e) => { this.showGameByCategory(this.state.currentPage) }}
            >
                <option value="" selected disabled hidden>Choose Category Game</option>
                <option value="ALL" >All</option>
                {
                    this.state.category.map(val => {
                        return (
                            <option value={val.categoryName}>{val.categoryName}</option>
                        )
                    })
                }
            </select>
        )
    }

    showGameByCategory = (currentPage) => {
        if (this.state.categoryNow == "ALL") {
            this.getAllGame(this.state.currentPage)
        } else if (this.state.sortBy == "name" && this.state.orderBy == "asc") {
            Axios.get(`${API_URL}/game/gamesNameAsc?page=${currentPage}&size=3`, {
                params: {
                    category: this.state.categoryNow
                }
            })
                .then((res) => {
                    console.log(res.data)
                    this.setState({ productGame: res.data.content })
                    this.setState({ currentPage: res.data.number })
                })
                .catch((err) => {
                    console.log(err)
                })
        } else if (this.state.sortBy == "name" && this.state.orderBy == "desc") {
            Axios.get(`${API_URL}/game/gamesNameDesc?page=${currentPage}&size=3`, {
                params: {
                    category: this.state.categoryNow
                }
            })
                .then((res) => {
                    console.log(res.data)
                    this.setState({ productGame: res.data.content })
                    this.setState({ currentPage: res.data.number })
                })
                .catch((err) => {
                    console.log(err)
                })
        } else if (this.state.sortBy == "price" && this.state.orderBy == "asc") {
            Axios.get(`${API_URL}/game/gamesPriceAsc?page=${currentPage}&size=3`, {
                params: {
                    category: this.state.categoryNow
                }
            })
                .then((res) => {
                    console.log(res.data)
                    this.setState({ productGame: res.data.content })
                    this.setState({ currentPage: res.data.number })
                })
                .catch((err) => {
                    console.log(err)
                })
        } else if (this.state.sortBy == "price" && this.state.orderBy == "desc") {
            Axios.get(`${API_URL}/game/gamesPriceDesc?page=${currentPage}&size=3`, {
                params: {
                    category: this.state.categoryNow
                }
            })
                .then((res) => {
                    console.log(res.data)
                    this.setState({ productGame: res.data.content })
                    this.setState({ currentPage: res.data.number })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    showSortGame = (currentPage) => {
        if (this.state.orderBy == "ALL" || this.state.sortBy == "ALL") {
            Axios.get(`${API_URL}/game/games?page=${currentPage}&size=3`)
                .then((res) => {
                    this.setState({ productGame: res.data.content })
                    console.log(res.data)
                    this.setState({ currentPage: res.data.number })
                })
                .catch((err) => {
                    console.log(err)
                })
        } else if (this.state.categoryNow != "ALL") {
            this.showGameByCategory(currentPage)
        } else {
            Axios.get(`${API_URL}/game/filter?page=${currentPage}&size=3`, {
                params: {
                    pageNo: currentPage,
                    sort: this.state.sortBy,
                    orderBy: this.state.orderBy,
                    category: this.state.categoryNow
                }
            })
                .then((res) => {
                    this.setState({ productGame: res.data.content })
                    console.log(res.data)
                    this.setState({ currentPage: res.data.number })
                })
                .catch((err) => {
                    console.log(err)
                    console.log(this.state.categoryNow)
                })
        }

    }

    searchProduct = (e) => {
        const { value } = e.target
        this.setState({ search: value })
    }

    getGameFilter = (currentPage) =>{
        Axios.get(`${API_URL}/game/custom?page=${currentPage}&size=3&name=${this.state.search}`)
        .then((res) =>{
            console.log(res.data)
            this.setState({productGame: res.data.content})
        })
        .catch(err =>{
            console.log(err)
        })
    }

    render() {
        const { currentPage } = this.state
        const totalPage = this.state.productGame.length / 3
        return (
            <div className="bg-color">
                <div className="container bg-color">
                    <br />
                    <div className="row">
                        <div className="col-9">
                            {this.renderGame()}
                            <input type="button" className="prev-btn" value="Previous" disabled={currentPage === 0 ? true : false} onClick={(e) => { this.prevHandler(e) }} />
                            <input type="button" className="next-btn" value="Next" disabled={currentPage === totalPage ? true : false} onClick={(e) => { this.nextHandler(e) }} />
                        </div>
                        <div className="col-3">
                            <div className="navbar-search">
                                <div className="input-icons">
                                    <button className="btn-search">
                                        <FontAwesomeIcon
                                            className="mt-3"
                                            icon={faSearch}>
                                        </FontAwesomeIcon>
                                    </button>
                                    <input
                                        className="input-field"
                                        type="text"
                                        placeholder="Search"
                                        onChange={(e) => { this.searchProduct(e) }}
                                        onKeyUp={() => this.getGameFilter(this.state.currentPage)}
                                    >
                                    </input>
                                </div>
                            </div>
                            <div>
                                {this.renderCategory()}
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <select
                                        className="custom-text-input h-100 pl-3 select-option"
                                        onClick={(e) => this.sortHandler(e)}
                                    >
                                        <option value="" selected disabled hidden>Sort By</option>
                                        <option value="ALL" >All</option>
                                        <option value="name" >Sort By Name</option>
                                        <option value="price" >Sort By Price</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <select
                                        className="custom-text-input h-100 pl-3 select-option"
                                        onChange={(e) => this.orderByHandler(e)}
                                        onClick={() => { this.showSortGame(this.state.currentPage) }}
                                    >
                                        <option value="" selected disabled hidden>Sort By</option>
                                        <option value="ALL" >All</option>
                                        <option value="asc" >Order By Ascending</option>
                                        <option value="desc" >Order By Descending</option>
                                    </select>
                                </div>
                            </div>
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

export default connect(mapsStateToProps)(Browse)