import React, { Component } from 'react';
import _intersection from 'lodash/intersection';
import _isPlainObject from 'lodash/isPlainObject';
import { pure } from 'recompose';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import Scrollbars from '@components/common/scrollbars';
import Styles from '@assets/scss/popup.scss';

/* eslint-disable new-cap */
const SortableItem = SortableElement(({ value }) => {
    if (typeof value === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: value }} />;
    } else if (value instanceof HTMLElement) {
        return (
            <div
                ref={(dom) => {
                    if (dom) {
                        dom.appendChild(value);
                    }
                }}
            />
        );
    }
});

const SortableList = SortableContainer(({ items }) => {
    return (
        <div>
            {items.map((value, index) => {
                let key = `item-${index}`;
                let item = value;
                if (_isPlainObject(value)) {
                    key = value.key || key;
                    item = value.item;
                }
                return <SortableItem key={key} index={index} value={item}/>;
            })}
        </div>
    );
});

class Sortable extends Component {
    state = {
        items: this.props.items || [],
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex),
        });
    };

    shouldCancelStart = (e) => {
        const { target } = e;
        const { className = '' } = target;
        const { sortableTarget } = this.props;
        const list = className.split(' ');
        if (!_intersection(sortableTarget, list).length) {
            return true;
        }
    };

    getShouldCancelStart() {
        const { sortableTarget } = this.props;
        if (Array.isArray(sortableTarget) && sortableTarget.length) {
            return this.shouldCancelStart;
        }
    }

    render() {
        const { axis = 'y', lockAxis, height, items: items2 } = this.props;
        const { items = [] } = this.state;
        const shouldCancelStart = this.getShouldCancelStart();
        console.log('sortable render');
        console.log(this.props);
        return (
            <Scrollbars
                heightRelativeToParent={height}
                className={`${Styles.sortable} ${Styles.scrollbar}`}
            >
                <SortableList
                    axis={axis}
                    lockAxis={lockAxis}
                    items={items2}
                    onSortEnd={this.onSortEnd}
                    shouldCancelStart={shouldCancelStart}
                />
            </Scrollbars>
        );
    }
}

export default pure(Sortable);
