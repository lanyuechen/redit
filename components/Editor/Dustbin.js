import React, { PropTypes, Component } from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';
import Card from './Card';

const defaultStyle = {
    height: '100%',
    width: '100%',
    padding: 10,
    border: '1px dashed #000',
    borderRadius: '3px',
    cursor: 'move',
};

const spec = {
    drop(props, monitor) {
        const isOver = monitor.isOver({ shallow: true });
        if (isOver) {
            props.onDrop({
                _id: props._id,
                item: monitor.getItem()
            });
        }
    }
};

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop()
});

const dragSpec = {
    beginDrag(props) {
        console.log('dustbin beginDrag', props);
        const { _id, accepts, type } = props;
        return {_id, accepts, type, act: 'update'};
    },
    endDrag(props, monitor) {
        const didDrop = monitor.didDrop();
        if (!didDrop) {
            props.onDrop({
                item: {
                    ...monitor.getItem(),
                    act: 'delete'
                }
            });
        }
    }
};

const dragCollect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
})

@DropTarget(props => props.accepts, spec, collect)
@DragSource(props => props.type, dragSpec, dragCollect)
class Dustbin extends Component {
    static propTypes = {
        _id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        accepts: PropTypes.array,
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        onDrop: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
    }

    onDrop = (item) => {
        console.log('dustbin onDrop', item);
    };

    render() {
        const { canDrop, isOver, connectDropTarget, connectDragSource, children, style } = this.props;
        const isActive = canDrop && isOver;

        let backgroundColor = '#eee';
        if (isActive) {
            backgroundColor = 'darkgreen';
        } else if (canDrop) {
            backgroundColor = 'darkkhaki';
        }

        return connectDragSource(
            connectDropTarget(
                <div style={{...defaultStyle, ...style, backgroundColor}}>
                    {children}
                </div>
            )
        );
    }
}

export default Dustbin;
