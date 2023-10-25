import React, { useState } from 'react'
import styled from 'styled-components'

const DropdownContainer = styled.div`
  display: flex;
  align-items: left;
  margin: 0px 0px 10px 0px;
`

const DropdownLabel = styled.div`
  margin-right: 10px;
  text-align: left;
  color: black;
  font-weight: 500;
`

const DropdownSelect = styled.select`
  outline: none;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: #fff;

  width: 100%;
`

export const CustomPriceInput = styled.input`
  font-size: 16px;
  padding: 12px;
  outline: none;
  border: 0.41px solid #cecece8c;
  border-radius: 1px;
  background-color: rgb(255 255 255);
  color: rgb(51, 51, 51);
  width: 100%;
`

const SubmitButton = styled.button`
  font-size: 16px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #555;
  }
`

const PriceListDropdown = ({ prices, onSelectPrice, discounts }) => {
  const [selectedValue, setSelectedValue] = useState(prices[0])
  const [customPrice, setCustomPrice] = useState('')

  const handleChange = (event) => {
    setSelectedValue(event.target.value)
    onSelectPrice(event.target.value)
  }

  const handleCustomPriceChange = (event) => {
    setCustomPrice(event.target.value)
  }

  const handleSubmit = () => {
    const price = customPrice || selectedValue
    onSelectPrice(price)
  }

  return (
    <>
      {/* <DropdownLabel htmlFor="price">Price options and duration</DropdownLabel> */}
      <DropdownContainer>
        <DropdownSelect id="price" onChange={handleChange}>
          <option key={0} value={0}>
            Price Options & Duration
          </option>

          {prices.map((price) => (
            <option
              key={price?.price}
              value={`${price?.price}-${price?.duration}`}
            >
              <span>AED {price?.price}</span>
              <span style={{ float: 'right' }}>
                &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {Math.floor(price?.duration / 60) +
                  'h-' +
                  (price?.duration % 60) +
                  'm'}
              </span>
            </option>
          ))}

          {/* <option value="Discounts">Discounts</option> */}
        </DropdownSelect>
        {selectedValue === 'Discounts' && (
          <DropdownSelect
            id="price"
            value={customPrice}
            onChange={handleCustomPriceChange}
          >
            {discounts.map((discounts) => (
              <option value={discounts.value}>{discounts.value}</option>
            ))}
          </DropdownSelect>
        )}
        {/* <SubmitButton onClick={handleSubmit}>Submit</SubmitButton> */}
      </DropdownContainer>
    </>
  )
}

export default PriceListDropdown
