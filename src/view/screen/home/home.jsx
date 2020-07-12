import React from "react";
import Slider from "react-slick";
import "./home.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { connect } from 'react-redux'
import ButtonUI from "../../components/Button/Button.tsx"
import Axios from "axios";
import { API_URL } from "../../../redux/API";


class HomeScreen extends React.Component {

    state = {
        productGame: [],
        category: [],
        categoryNow: "",
        sortBy: "",
        conditionSort: 0
    }
    
    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    componentDidMount() {
        this.getAllGame()
        this.getAllCategory()
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
                                    <h2>{val.price}</h2>

                                    <h1>{this.props.user.search}</h1>
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
                className="custom-text-input h-100 pl-3"
                style={{ border: "none" }}
                onChange={(e) => this.categoryHandler(e)}
                onClick={(e) => { this.showGameByCategory(this.state.categoryNow) }}
            >
                <option value="" selected disabled hidden>Choose Category Game</option>
                <option value="ALL" >All</option>
                {
                    this.state.category.map(val => {
                        return (
                            <option value={val.id}>{val.categoryName}</option>
                        )
                    })
                }
            </select>
        )
    }


    next() {
        this.slider.slickNext();
    }
    previous() {
        this.slider.slickPrev();
    }


    render() {
        const settings = {
            speed: 700,
            autoplay: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
        }
        return (
            <div className="bg-color">
                <div className="container bg-color carousel" >
                    <Slider ref={c => (this.slider = c)} {...settings}>
                        <div>
                            <Link>
                                <img src="https://cdn2.unrealengine.com/male-v-1920x1080-en-1920x1080-255566056.jpg"
                                    alt=""
                                    style={{ width: "100%", border: "none", height: "360px" }}
                                />
                            </Link>
                        </div>
                        <div>
                            <Link>
                                <img src="https://cdn1.epicgames.com/undefined/offer/ACOD_Portrait-552x576-64d0966bcf63c374163a5b920f68b253.jpg"
                                    alt=""
                                    style={{ width: "100%", border: "none", height: "360px" }}
                                />
                            </Link>
                        </div>
                        <div>
                            <Link>
                                <img src="https://cdn1.epicgames.com/fn/offer/13BR_BPLaunch_EGS_S2_1200x1600-1200x1600-a39a6070e97ea0938d60ca3b19cbbe7b.jpg"
                                    alt=""
                                    style={{ width: "100%", border: "none", height: "360px" }}
                                />
                            </Link>
                        </div>
                    </Slider>
                    <br>
                    </br>
                    <div style={{ textAlign: "center" }}>
                        <a onClick={this.previous}>
                            <FontAwesomeIcon
                                className="mt-3"
                                icon={faChevronLeft}
                                style={{ color: "white", fontSize: "26px" }}>
                            </FontAwesomeIcon>
                        </a>
                        <a onClick={this.next}>
                            <FontAwesomeIcon
                                className="mt-3"
                                icon={faChevronRight}
                                style={{ color: "white", fontSize: "26px" }}>
                            </FontAwesomeIcon>
                        </a>
                    </div>
                </div>
                <br />
                <div className="bg-color2 " style={{ height: "500px" }}>
                    <div className="container ">
                        <div>
                            <a href="https://www.facebook.com/epicgames">
                                <FontAwesomeIcon
                                    className="mt-3"
                                    icon={faFacebook}
                                    style={{ color: "white", fontSize: "26px" }}>
                                </FontAwesomeIcon>
                            </a>
                            <a href="https://twitter.com/epicgames">
                                <FontAwesomeIcon
                                    className="mt-3"
                                    icon={faTwitter}
                                    style={{ color: "white", fontSize: "26px" }}>
                                </FontAwesomeIcon>
                            </a>
                            <a href="youtube.com/epicgamesinc">
                                <FontAwesomeIcon
                                    className="mt-3"
                                    icon={faYoutube}
                                    style={{ color: "white", fontSize: "26px" }}>
                                </FontAwesomeIcon>
                            </a>
                        </div>
                        <div>
                            <h4 style={{ color: "#e7e7e7" }}>Made By Epic Games</h4>
                            <a href="www.google.com" style={{ color: "#e7e7e7" }}>
                                Fortnite
                            </a>
                        </div>
                        <div>
                            <h5 style={{ color: "#e7e7e7" }}>© 2020, Epic Games, Inc. All rights reserved. Epic, Epic Games, the Epic Games logo, Fortnite, the Fortnite logo, Unreal, Unreal Engine, the Unreal Engine logo, Unreal Tournament, and the Unreal Tournament logo are trademarks or registered trademarks of Epic Games, Inc. in the United States of America and elsewhere. Other brands or product names are the trademarks of their respective owners. Non-US transactions through Epic Games International, S.à r.l.   </h5>
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

export default connect(mapsStateToProps)(HomeScreen)