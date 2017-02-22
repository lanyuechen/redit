import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Editor from './components/Editor';

import './common';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <Editor />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
