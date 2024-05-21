import styled from 'styled-components';

export const ListContainer = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    width: 220px;
    display: flex;
    flex-direction: column;
    background-color: #f8f9fa;
`;

export const ListTitle = styled.h3`
    padding: 8px;
    background-color: #007bff;
    color: white;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
`;

export const ListContent = styled.div`
    padding: 8px;
    background-color: white;
    flex-grow: 1;
    min-height: 100px;
`;

export const ItemContainer = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    &:hover {
        background-color: #f1f1f1;
    }
`;