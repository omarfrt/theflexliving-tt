"use client";
import React from 'react';
import styled from 'styled-components';
import { generateId } from './kanbanBoard';

const FormWrapper = styled.div`
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
z-index: 100;
background: white;
padding: 20px;
border-radius: 10px;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
`;


const Form = styled.form`
width: 100%;
  display: flex;
  flex-direction: column;
gap: 20px;
align-items: center;
color: black;
`;

const Label = styled.label`
display: flex;
flex-direction: column;
gap: 10px;
text-align: left;
`;

const Input = styled.input`
padding: 10px;
border: 1px solid #ccc;
border-radius: 4px;
font-size: 16px;
width: 100%;
`;



const Button = styled.button`
  padding: 10px;
  margin-top: 20px;
  background: #6a0dad;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #5a0cbe;
  }
`;

const AddForm = ({setItems, closeForm}) => {
  const handleSubmit = (e) => {
    const _id= generateId();
    e.preventDefault();
    const data = {
      _id: _id*_id,
      address: e.target.elements.address.value,
      rentalCost: { "April:2024": e.target.elements.rentalCost.value },
      propertyName: e.target.elements.propertyName.value,
      tag: e.target.elements.tag.value,
      contractStartDate: e.target.elements.contractStartDate.value,
      contractEndDate: e.target.elements.contractEndDate.value,
      directCost: { "April:2024": e.target.elements.directCost.value },
      group: "Pending",
      city: e.target.elements.city.value,
      fixedCost: e.target.elements.fixedCost.value,
      __v:0,
      id: _id,
    };
    setItems((items) => [...items, data]);
    e.target.reset();
    closeForm(false);
  };
  return (
    
        <FormWrapper>
          <Form onSubmit={handleSubmit}>
          <Label >
    Property Name:
    <Input type="text" name="propertyName" placeholder="Enter property name..." />
  </Label>
        <Label>
    Address:
    <Input type="text" name="address" placeholder="Enter address..." />
  </Label>
  <Label>
    City:
    <Input type="text" name="city" placeholder="Enter city..." />
  </Label>
  <Label>
    Tag:
    <Input type="text" name="tag" placeholder="Enter tag..." />
  </Label>
  <Label>
    Contract Start Date:
    <input type="date" name="contractStartDate" />
  </Label>
  <Label>
    Contract End Date:
    <input type="date" name="contractEndDate" />
  </Label>
  <Label>
    Rental Cost (April 2024):
    <Input type="text" name="rentalCost" placeholder="Enter rental cost..." />
  </Label>
  <Label>
    Direct Cost (April 2024):
    <Input type="text" name="directCost" placeholder="Enter direct cost..." />
  </Label>
  <Label>
    Fixed Cost:
    <input type="text" name="fixedCost" placeholder="Enter fixed cost..." />
  </Label>
  <Button type="submit">Submit</Button>
          </Form>
        </FormWrapper>
  );
};

export default AddForm;
