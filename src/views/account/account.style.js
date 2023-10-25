import styled from "styled-components";
export const Wrapper = styled.div`
background-color : ${props => props.primary ? "#F1F6FF" : "red"};
padding : 1rem;
border-radius : 5px;
justify-content : ${props => props.center ? "center" : ""};
`;
export const Circle = styled.span`
border-radius : 50%;
height : 5px;
width : 5px;
background-color : #2EB3F0;
align-self : center;
padding-right : ${props => props.paddingRight ? "1rem"  : "0rem"};

`;