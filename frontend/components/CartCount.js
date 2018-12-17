import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const AnimationStyles = styled.span`
    position: relative;

    .count {
        display: block;
        position: relative;
        transition: all 400ms;
        backface-visibility: hidden;
    }

    /* Initial state of the entered dot */
    .count-enter {
        transform: rotateX(0.5turn);
    }

    .count-enter-active {
        transform: rotateX(0);
    }

    .count-exit {
        top: 0;
        position: absolute;
        transform: rotateX(0);
    }

    .count-exit-active {
        transform: rotateX(0.5turn);
    }
`;

const Dot = styled.div`
    background: ${props => props.theme.red};
    border-radius: 50%;
    color: white;
    font-feature-settings: 'tnum';
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    font-weight: 100;
    line-height: 2rem;
    margin-left: 1rem;
    min-width: 3rem;
    padding: 0.5rem;
`;

const CartCount = ({ count }) => {
    return <AnimationStyles>
            <TransitionGroup>
                <CSSTransition unmountOnExit className="count" classNames="count" key={count} timeout={{ enter: 400, exit: 400 }}>
                    <Dot>{count}</Dot>
                </CSSTransition>
            </TransitionGroup>
        </AnimationStyles>;
};

export default CartCount;