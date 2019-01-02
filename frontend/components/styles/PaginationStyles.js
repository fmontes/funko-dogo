import styled from 'styled-components';

const PaginationStyles = styled.div`
    text-align: center;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    justify-content: center;
    align-content: center;
    margin: 2rem 0;
    border: 1px solid ${props => props.theme.lightgrey};
    border-radius: 10px;
    & > * {
        margin: 0;
        padding: 15px 30px;
        border-right: 1px solid ${props => props.theme.lightgrey};
        &:last-child {
            border-right: 0;
        }
    }
    a[aria-disabled='true'] {
        color: grey;
        pointer-events: none;
    }
`;

export default PaginationStyles;
