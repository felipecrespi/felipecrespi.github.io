import React, { Component } from 'react';
import { MarkerF, InfoWindowF } from '@react-google-maps/api';
class CustomMarker extends Component {
    state = {
        showInfoWindow: false
    };
    handleMouseOver = e => {
        this.setState({
            showInfoWindow: true
        });
    };
    handleMouseExit = e => {
        this.setState({
            showInfoWindow: false
        });
    };
    render() {
        const { showInfoWindow } = this.state;
        return (
            <MarkerF position={this.props.position} onMouseOver=
{this.handleMouseOver} onMouseOut={this.handleMouseExit}>
                {showInfoWindow && (
                    <InfoWindowF>
                        <h4>{this.props.title}</h4>
                    </InfoWindowF>
                )}
            </MarkerF>
        );
    }
}
export default CustomMarker;