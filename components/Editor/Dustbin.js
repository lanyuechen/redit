import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const style = {
    height: '100%',
    width: '100%',
    padding: 10,
    border: '1px dashed #000',
    borderRadius: '3px'
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

@DropTarget(props => props.accepts, spec, collect)
class Dustbin extends Component {
    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        onDrop: PropTypes.func.isRequired,
    };

    static defaultProps = {
        items: []
    };

    constructor(props) {
        super(props);
    }

    onDrop = (item) => {
        console.log('dustbin onDrop', item);
    };

    render() {
        const { canDrop, isOver, connectDropTarget, children } = this.props;
        const isActive = canDrop && isOver;

        let backgroundColor = '#eee';
        if (isActive) {
            backgroundColor = 'darkgreen';
        } else if (canDrop) {
            backgroundColor = 'darkkhaki';
        }

        return connectDropTarget(
            <div style={{...style, backgroundColor}}>
                {children}
            </div>
        );
    }
}

export default Dustbin;
