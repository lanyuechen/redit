import React, { PropTypes } from 'react';
import styles from './styles.module.css';

class Layout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { left, right, top, bottom, size, fixed, children, style } = this.props;
        let styleFixed = {}, styleContent = {};
        if (left) {
            styleFixed = {
                width: size,
                float: 'left'
            };
            if (fixed) {
                styleContent = {
                    paddingLeft: size
                }
            }
        } else if (right) {
            styleFixed = {
                width: size,
                float: 'right'
            };
            if (fixed) {
                styleContent = {
                    paddingRight: size
                }
            }
        } else if (top) {
            styleFixed = {
                height: size
            };
            if (fixed) {
                styleContent = {
                    paddingTop: size
                }
            }
        } else if (bottom) {
            if (fixed) {
                styleFixed = {
                    height: size,
                    position: 'absolute',
                    width: '100%',
                    bottom: 0
                }
                styleContent = {
                    paddingBottom: size
                }
            } else {
                styleFixed = {
                    height: size
                }
            }
        }
        return (
            <div className={styles.layout} style={style}>
                {!bottom && <div className={styles.fixed} style={styleFixed}>
                    {left || right || top}
                </div>}
                <div className={fixed ? styles.absolute : styles.content} style={styleContent}>
                    <div className={styles.full}>{children}</div>
                </div>
                {bottom && <div className={styles.fixed} style={styleFixed}>
                    {bottom}
                </div>}
            </div>
        )
    }
}

Layout.propTypes = {
    left: PropTypes.element,
    right: PropTypes.element,
    top: PropTypes.element,
    bottom: PropTypes.element,
    fixed: PropTypes.bool,
    size: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

Layout.defaultProps = {
    style: {},
    size: '20%'
};

export default Layout;