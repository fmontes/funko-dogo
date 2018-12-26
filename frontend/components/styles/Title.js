import styled from 'styled-components';

const Title = styled.h3`
    margin: 0 1rem;
    text-align: center;
    transform: skew(-5deg) rotate(-1deg);
    margin-top: -3rem;
    text-shadow: ${props => props.theme.ts};

    a {
        background: ${props => props.theme.yellow};
        display: inline;
        line-height: 1.3;
        font-size: 4rem;
        text-align: center;
        color: ${props => props.theme.black};
        padding: 0 1rem;
    }
`;

export default Title;
