import React, { Component } from 'react';
import { CommonUtils } from '@utils/Common';
import { debounce } from 'lodash';
import Styles from '../../assets/scss/popup.scss';
import OutsideClick from "../common/outsideClick";

/* eslint-disable jsx-a11y/anchor-is-valid*/
/* eslint-disable array-element-newline */
const numberList = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    '-', '0', '.',
];

const noop = () => {};

class angle extends Component {
    getPositionOptions() {
        return {
            widthMargin: 1,
            maxArrowPosition: 406,
            arrowWidth: 15,
            arrowHeight: 9,
            width: 408,
            height: 300,
        };
    }

    constructor(props) {
        super(props);

        const defaultState = {
            degree: 0,
        };
        this.state = Object.assign(
            defaultState,
            CommonUtils.getDefaultComponentPosition(props, this.getPositionOptions())
        );

        this.handleAngleArrowMove = this.handleAngleArrowMove.bind(this);
        this.removeMouseMove = this.removeMouseMove.bind(this);
        this.addMouseMove = this.addMouseMove.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
        this.alignPosition();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    handleWindowResize = debounce(() => {
        this.alignPosition();
    }, 300);

    alignPosition(updateState) {
        this.setState(() => {
            return Object.assign(
                CommonUtils.getAlignPosition(this.props, this.widgetDom, this.getPositionOptions()),
                updateState
            );
        });
    }

    handleAngleArrowMove(event) {
        event.preventDefault();
        event.stopPropagation();

        let classifiedEvent;
        if (window.TouchEvent && event instanceof window.TouchEvent) {
            classifiedEvent = event.changedTouches[0];
        } else {
            classifiedEvent = event;
        }

        const { clientX, clientY } = classifiedEvent;
        console.log(this.calculateArrowDegree(clientX, clientY));
    };

    calculateArrowDegree(mousePosX, mousePosY) {
        const arrowRect = this.arrow.getBoundingClientRect();
        const arrowPosX = arrowRect.left + 10; //10 = arrowDomWidth / 2
        const arrowPosY = arrowRect.bottom - 2; // 2 는 마우스 커서 포인터를 맞추기 위한 상수

        const dy = mousePosY - arrowPosY;
        const dx = mousePosX - arrowPosX;

        const angleRadian = Math.atan2(-dy, dx);
        let angleDegree = 90 - (angleRadian * 180 / Math.PI);

        if (angleDegree < 0) {
            angleDegree += 360;
        }

        return (Math.round(angleDegree / 15) * 15) % 360;
    }

    addMouseMove() {
        document.addEventListener('mousemove', this.handleAngleArrowMove);
        document.addEventListener('touchmove', this.handleAngleArrowMove);
        document.addEventListener('mouseup', this.removeMouseMove);
        document.addEventListener('touchend', this.removeMouseMove);
    }

    removeMouseMove() {
        document.removeEventListener('mousemove', this.handleAngleArrowMove);
        document.removeEventListener('touchmove', this.handleAngleArrowMove);
    }

    _makeNumberButtons() {
        const { onButtonPressed = noop } = this.props;

        return numberList.map((value) => (
            <a className={Styles.btn_cnt} key={value} onClick={() => onButtonPressed(value)}>
                {value}
            </a>
        ));
    }

    render() {
        const { onOutsideClick = noop, onBackButtonPressed = noop } = this.props;
        const { isUpStyle, arrowLeft, componentPosition } = this.state;

        return (
            <OutsideClick
                onOutsideClick={() => {
                    onOutsideClick();
                }}
                eventTypes={['mouseup', 'touchend', 'wheel']}
            >
                <div
                    ref={(dom) => (this.widgetDom = dom)}
                    style={componentPosition}
                    className={`${Styles.tooltip_box} ${Styles.clock_box} ${
                        isUpStyle ? Styles.up : ''
                    }`}
                >
                    <div className={Styles.tooltip_inner}>
                        <div className={Styles.clock_board}>
                            <div
                                className={`${Styles.clock}`}
                                onMouseDown={this.addMouseMove}
                                onTouchStart={this.addMouseMove}
                                onClick={this.handleAngleArrowMove}
                            >
                                <div
                                    ref={(dom) => (this.arrow = dom)}
                                    className={`${Styles.arrow}`}
                                >
                                </div>
                            </div>
                        </div>
                        <div className={Styles.time_board}>
                            {this._makeNumberButtons()}
                            <a
                                className={`${Styles.btn_cnt} ${Styles.btn_del} ${Styles.imico_pop_key_del}`}
                                onClick={() => {
                                    onBackButtonPressed();
                                }}
                            >
                                <span className={Styles.blind}>지우기</span>
                            </a>
                        </div>
                    </div>
                    <span style={{ left: `${arrowLeft}px` }} className={Styles.arr}>
                        <i />
                    </span>
                </div>
            </OutsideClick>
        );
    }
}

export default angle;
