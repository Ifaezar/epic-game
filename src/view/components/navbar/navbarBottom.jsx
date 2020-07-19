import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import "../navbar/navbar.css";
import { connect } from 'react-redux'

class NavbarBottom extends React.Component {
    render() {
        return (
            <div className="bg-color2 " style={{ height: "400px" }}>
                <div className="container ">
                    <div>
                        <a href="https://www.facebook.com/epicgames">
                            <FontAwesomeIcon
                                className="mt-3 mr-2"
                                icon={faFacebook}
                                style={{ color: "white", fontSize: "32px" }}>
                            </FontAwesomeIcon>
                        </a>
                        <a href="https://twitter.com/epicgames">
                            <FontAwesomeIcon
                                className="mt-3 mr-2"
                                icon={faTwitter}
                                style={{ color: "white", fontSize: "32px" }}>
                            </FontAwesomeIcon>
                        </a>
                        <a href="youtube.com/epicgamesinc">
                            <FontAwesomeIcon
                                className="mt-3"
                                icon={faYoutube}
                                style={{ color: "white", fontSize: "32px" }}>
                            </FontAwesomeIcon>
                        </a>
                    </div>
                    <div>
                        <span style={{ fontSize:"24px", color: "#ccc" }}>Made By Epic Games</span>
                        <br></br>
                        <a href={`/product/${7}`} style={{fontSize:"18px", color: "#e7e7e7" }}>
                            Fortnite
                    </a>
                    </div>
                    <div className="mt-5">
                        <h5 style={{ color: "#e7e7e7" }}>© 2020, Epic Games, Inc. All rights reserved. Epic, Epic Games, the Epic Games logo, Fortnite, the Fortnite logo, Unreal, Unreal Engine, the Unreal Engine logo, Unreal Tournament, and the Unreal Tournament logo are trademarks or registered trademarks of Epic Games, Inc. in the United States of America and elsewhere. Other brands or product names are the trademarks of their respective owners. Non-US transactions through Epic Games International, S.à r.l.   </h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavbarBottom