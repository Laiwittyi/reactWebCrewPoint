import React from 'react';
import Rainbow from './hoc/Rainbow';

const Home = ({ user }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center',     // Center vertically
                // Full viewport height to center the text vertically
            }}
        >
            <h2>{user ? user.name + "様、" : ''}すかいらーくクルーポイントからようこそ</h2>

        </div>
    )
}

export default Rainbow(Home)