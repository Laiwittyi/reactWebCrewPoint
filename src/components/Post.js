import React, { Component } from 'react';
import { useParams } from 'react-router-dom';

class Post extends Component {
    componentDidMount() {
        let id = useParams();
        console.log(id)
    }
    render() {
        return (
            <dv>
                <h4>Route Param</h4>
            </dv>
        )
    }
}
export default Post