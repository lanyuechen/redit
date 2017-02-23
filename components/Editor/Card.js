import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';

const style = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    cursor: 'move',
};

const spec = {
    beginDrag(props) {
        console.log('beginDrag', props);
        return {...props.config, act: 'add'};
    }
};

const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
});

@DragSource(props => props.type, spec, collect)
class Card extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { isDragging, connectDragSource, children } = this.props;
        const opacity = isDragging ? 0.4 : 1;

        return connectDragSource(
            <div style={{...style, opacity}}>
                {children}
            </div>
        )
    }
}

export default Card;
