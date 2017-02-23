import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';
import Dustbin from './Dustbin';
import Card from './Card';
import ItemTypes from './ItemTypes';
import { findIndex } from 'lodash';

import Layout from '../../components/Layout';

const cards = [
    {
        _id: '1',
        type: ItemTypes.LAYOUT,
        accepts: [ItemTypes.LAYOUT, ItemTypes.ELEMENT]
    }, {
        _id: '2',
        type: ItemTypes.ELEMENT,
        accepts: []
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
        const { _id, item } = data;
        if (item.act == 'add') {
            this.setState(update(this.state, {
                dustbin: {
                    $push: [
                        {...item, pid: _id, _id: $$.uuid()}
                    ]
                }
            }))
        } else if (item.act == 'update') {
            const idx = findIndex(this.state.dustbin, d => d._id == item._id);
            if (idx > -1) {
                this.setState(update(this.state, {
                    dustbin: {
                        [idx]: {
                            $merge: {
                                pid: _id
                            }
                        }
                    }
                }))
            }
        } else if (item.act == 'delete') {
            this.setState({
                dustbin: this.rmDustbinPoll(this.state.dustbin, [item._id])
            })
        }

    };

    rmDustbinPoll = (data, except) => {
        const _except = [], _data = [];
        data.map(d => {
            if (except.indexOf(d.pid) > -1 || except.indexOf(d._id) > -1) {
                _except.push(d._id);
            } else {
                _data.push(d);
            }
        });
        if (_except.length == 0) {
            return _data;
        }
        return this.rmDustbinPoll(_data, [...except, ..._except]);
    };

    renderDustbin = (id, data) => {
        const _data = data.filter(d => d.pid !== id);
        const children = data.filter(d => d.pid == id);
        if (children.length == 0) {
            return null;
        }
        const height = 1 / children.length * 100 + '%';
        return children.map((d, i) => (
            <Dustbin
                key={d._id}
                _id={d._id}
                type={d.type}
                accepts={d.accepts}
                onDrop={this.onDrop}
                style={{height}}
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
                <Dustbin _id='0' type={ItemTypes.LAYOUT}
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
