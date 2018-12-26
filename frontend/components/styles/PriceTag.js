import styled from 'styled-components';

const PriceTag = styled.span`
    background: ${props => props.theme.yellow};
    transform: rotate(3deg);
    color: ${props => props.theme.black};
    font-weight: 600;
    padding: 5px;
    line-height: 1;
    font-size: 3rem;
    display: inline-block;
    position: absolute;
    top: -3px;
    right: -3px;
    text-shadow: ${props => props.theme.ts}
`;

export default PriceTag;
