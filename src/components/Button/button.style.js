import styled, { css } from "styled-components";
import Button from "@mui/material/Button";
import { theme } from "antd";
import { color } from "@mui/system";


export const ButtonWrapper = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.2rem;
`;

export const buttonsOverAllShared = css`
  font-size: 0.8rem !important;
  font-family: Inter !important;
  font-weight: 400 !important;
  line-height: 1.375rem !important;
  text-transform: none !important;
  padding: 0.938rem 1rem !important;
  width: ${({ $width }) => ($width ? $width : "")} !important;
  height: 2rem !important;
  color: white !important;
  background-color: #0A9FDB !important;
  border: ${({ $border }) => ($border ? $border : "")} !important;
  border-radius: "50%";
  /* pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")}; */
  white-space: pre-wrap;
  position : ${({$position})=> $position ? $position : ''} !important;
  bottom : ${({$bottom})=> $bottom ? $bottom : ''} !important;
  cursor: ${({ $disabled }) =>
    $disabled ? "not-allowed !important" : "default"};

  > span > div {
    margin-left: 0.6em;

    > svg {
      fill: #fff;
      color: ${({ theme }) => theme.pureWhiteColor};
    }
  }
`;

export const CustomButton = styled(Button)`
  ${buttonsOverAllShared}


`;
