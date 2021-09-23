import axios from 'axios';
import React from 'react';

export default function updatePosition(ComposedComponent) {
    class Authenticate extends React.Component {

        constructor(props) {
            super(props)
            this.pushInterval = null;
        }

        componentDidMount() {
            this.pushInterval = updatePosition();
        }

        updatePosition() {
            axios.post("/").then((e) => {
                console.log(e)
            }).catch((e) => {
                console.log(e)
            })
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    }

    return Authenticate;
}