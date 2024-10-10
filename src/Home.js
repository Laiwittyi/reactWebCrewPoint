import React from 'react';
import Rainbow from './hoc/Rainbow';

const Home = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center',     // Center vertically
                height: '100vh',          // Full viewport height to center the text vertically
            }}
        >
            <h2>すかいらーくクルーポイントからようこそ</h2>

        </div>
    )
}

export default Rainbow(Home)