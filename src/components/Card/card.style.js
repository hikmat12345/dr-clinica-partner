import styled from "styled-components";

export const Wrapper = styled.div`
border-radius : 10px;
border : ${border => border.customBorder};
padding : ${props => props.customPadding};
background-color : ${props => props.bg };
height : ${props => props.height};
`
export const Line = styled.hr`
  color: #D5E0EF;
  border : 1px solid #D5E0EF;
`;
export const Container = styled.div`
display : flex;
flex-wrap : wrap;
@media (max-width: 768px) {
  flex-directin : column;
}
`;
export const CardContainer = styled.span`
width : 30%;
padding : 0.5rem;
@media (max-width: 768px) {
  width : 100%;
}
`