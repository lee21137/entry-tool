import React, { Component } from 'react';
import OutsideClick from '../common/outsideClick';
import Scrollbars from '../common/scrollbars';
import Styles from '@assets/scss/popup.scss';
// import { CommonUtils } from '@utils/Common';
// import root from 'window-or-global';
// import debounce from 'lodash/debounce';
import { pure } from 'recompose';

class ContextMenu extends Component {
    // alignPosition(coordinate) {
    // }

    render() {
        const {
            onOutsideClick,
            items,
            coordinate,
            eventTypes = ['mousedown', 'touchstart', 'wheel'],
        } = this.props;
        /*const { componentPosition } = this.state;*/
        return (
            <OutsideClick
                onOutsideClick={() => {
                    if (onOutsideClick) {
                        onOutsideClick();
                    }
                }}
                eventTypes={eventTypes}
            >
                <div
                    ref={(dom) => (this.contextDom = dom)}
                    style={{ left: coordinate.x, top: coordinate.y }}
                    className={`${Styles.tooltip_box} ${Styles.dropdown} ${Styles.auto_width}`}
                >
                    <div className={Styles.tooltip_inner}>
                        {items.length <= 5 && this.makeDropdownItem()}
                        {items.length > 5 && (
                            <Scrollbars heightRelativeToParent="260px" className={Styles.scrollbar}>
                                {this.makeDropdownItem()}
                            </Scrollbars>
                        )}
                    </div>
                </div>
            </OutsideClick>
        );
    }

    makeDropdownItem() {
        const { items, onOutsideClick } = this.props;

        return items.map((value, index) => {
            const { text, enable = true, callback } = value;
            return (
                <div
                    key={index}
                    className={`${Styles.item} ${enable ? '' : Styles.disabled}`}
                    onClick={() => {
                        if (enable && callback) {
                            callback();
                        }
                        if (onOutsideClick) {
                            onOutsideClick();
                        }
                    }}
                >
                    {text}
                </div>
            );
        });
    }
}

export default pure(ContextMenu);
