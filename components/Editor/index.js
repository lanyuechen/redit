import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';
import Dustbin from './Dustbin';
import Card from './Card';
import ItemTypes from './ItemTypes';

import Layout from '../../components/Layout';

const cards = [
    {
        _id: '1',
        type: ItemTypes.LAYOUT,
        accepts: [ItemTypes.LAYOUT, ItemTypes.ELEMENT]
    }, {
        _id: '2',
        type: ItemTypes.ELEMENT,
        accepts: [ItemTypes.LAYOUT, ItemTypes.ELEMENT]
    }, {
        _id: '3',
        type: ItemTypes.BOX,
        accepts: [ItemTypes.LAYOUT, ItemTypes.ELEMENT]
    }
];

@DragDropContext(HTML5Backend)
class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dustbin: []
        }
    }

    onDrop = (data) => {
        console.log('editor onDrop', data)
        this.setState(update(this.state, {
            dustbin: {
                $push: [
                    {...data.item, pid: data._id, _id: $$.uuid()}
                ]
            }
        }))
    };

    renderDustbin = (id, data) => {
        const _data = data.filter(d => d.pid !== id);
        return data.filter(d => d.pid == id).map((d, i) => (
            <Dustbin
                key={d._id}
                _id={d._id}
                accepts={d.accepts}
                onDrop={this.onDrop}
            >
                {this.renderDustbin(d._id, _data)}
            </Dustbin>
        ));
    };

    render() {
        const { dustbin } = this.state;

        const sidebar = (
            <div>
                {cards.map(d => (
                    <Card key={d._id} type={d.type} config={d}>
                        {d.type}
                    </Card>
                ))}
            </div>
        );

        return (
            <Layout left={sidebar} size={200} fixed={true} style={{height: '100%'}}>
                <Dustbin _id='0'
                    accepts={[ItemTypes.LAYOUT, ItemTypes.ELEMENT]}
                    onDrop={this.onDrop}
                >
                    {this.renderDustbin('0', dustbin)}
                </Dustbin>
            </Layout>
        )
    }
}

export default Container;
