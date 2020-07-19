import React from "react";
import Slider from "react-slick";
import "./home.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faGift } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { connect } from 'react-redux'
import ButtonUI from "../../components/Button/Button.tsx"
import Axios from "axios";
import { API_URL } from "../../../redux/API";


class HomeScreen extends React.Component {

    state = {
        productGame: [],
        carouselGame:[]
    }

    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    componentDidMount() {
        this.getAllGame()
        this.getAllGameSold()
    }


    getAllGame = () => {
        Axios.get(`${API_URL}/game`)
            .then((res) => {
                this.setState({ productGame: res.data })
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getAllGameSold = () => {
        Axios.get(`${API_URL}/game/sold`)
            .then((res) => {
                this.setState({ carouselGame: res.data })
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderCarouselItem = () => {
        const settings = {
            speed: 700,
            autoplay: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
        }
        if (this.state.carouselGame != "") {
            for (let i = 0; i < 2; i++) {
                return (
                    <div className="row">
                        <div className="col-9">
                            <Slider ref={c => (this.slider = c)} {...settings}>
                                <div>
                                    <img src={this.state.carouselGame[i].picture}
                                        alt=""
                                        style={{ width: "65%", border: "none", height: "360px" }}
                                    />
                                </div>
                                <div>
                                    <img src={this.state.carouselGame[i + 1].picture}
                                        alt=""
                                        style={{ width: "65%", border: "none", height: "360px" }}
                                    />
                                </div>
                            </Slider>
                        </div>
                        <div className="col-3">
                            <div>
                                <h1 style={{ color: "#fff" }}> Best Game</h1>
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <a onClick={this.previous}>
                                    <FontAwesomeIcon
                                        className="mt-3 mr-5"
                                        icon={faChevronLeft}
                                        style={{ color: "white", fontSize: "19px" }}>
                                    </FontAwesomeIcon>
                                </a>
                                <a onClick={this.next}>
                                    <FontAwesomeIcon
                                        className="mt-3"
                                        icon={faChevronRight}
                                        style={{ color: "white", fontSize: "19px" }}>
                                    </FontAwesomeIcon>
                                </a>

                            </div>
                        </div>
                    </div>
                )
            }
        }
    }


    next() {
        this.slider.slickNext();
    }
    previous() {
        this.slider.slickPrev();
    }


    render() {

        return (
            <div className="bg-color">
                <div className="container bg-color " >
                    <div className="container3 mb-5" >
                        {this.renderCarouselItem()}
                    </div>
                    <div className="container2" style={{ color: "#fff", backgroundColor: "#2a2a2a" }}>
                        <h1> <FontAwesomeIcon
                            className="mt-3"
                            icon={faGift}
                            style={{ color: "white", fontSize: "36px" }}>
                        </FontAwesomeIcon> Free Games</h1>
                        <div>
                            <Link to={`/product/${7}`} style={{ textDecoration: "none" }}>
                                <img src="https://image-cdn.essentiallysports.com/wp-content/uploads/20200630004117/fortnite-switch-hero.jpg" style={{ height: "200px" }} alt="" />
                            </Link>
                        </div>
                    </div>
                    <br></br>
                    <div className="container2" style={{ color: "#fff", backgroundColor: "#2a2a2a" }}>
                        <h1>  Recently Upload</h1>
                        <div className="row">
                            <div className="col-4 card" style={{backgroundColor: "#2a2a2a"}}>
                                <Link to={`/product/${6}`} style={{ textDecoration: "none" }}>
                                    <img src="https://lh3.googleusercontent.com/HCUkD69MAHEOj84Yi7Kb5vxHpCePTsmQI4g9vYuVPUo-87cWE6ZZIk0tiyYzaiS9zaAFMTXRNYJaaRczRN-yQYw" style={{ height: "200px" }} alt="" />
                                </Link>
                            </div>
                            <div className="col-4 card" style={{backgroundColor: "#2a2a2a"}}>
                                <Link to={`/product/${8}`} style={{ textDecoration: "none" }} >
                                    <img src="https://upload.wikimedia.org/wikipedia/en/d/dc/Watch_Dogs_Legion_cover_art.webp" style={{ height: "200px" }} alt="" />
                                </Link>
                            </div>
                            <div className="col-4 card" style={{backgroundColor: "#2a2a2a"}}>
                                <Link to={`/product/${5}`} style={{ textDecoration: "none" }}>
                                    <img src="https://aliagamepc.com/wp-content/uploads/2019/01/assassins-creed-origin-1.jpg" style={{ height: "200px" }} alt="" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <br />


            </div>
        )
    }
}

const mapsStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapsStateToProps)(HomeScreen)