import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
  width: ${({ props }) => (props.width ? "100%" : "")};
`;
export const FlexColumn = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const FlexRow = styled.span`
  display: flex;
  flex-direction: ${(props) => (props.column ? "column" : "row")};
  justify-content: ${(props) => (props.start ? "start" : "space-between")};
  width: ${(width) => (width ? "100%" : "")};
  padding-right: ${(props) => (props.paddingRight ? "2.5rem" : "0rem")};
  padding-top: ${(props) => (props.paddingTop ? "1rem" : "0rem")};
  padding-left: ${(props) => (props.paddingLeft ? "1rem" : "0rem")};
  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding-right: 0rem;
  }
`;

export const FlexAlignBaselineColumn = styled.span`
  display: flex;
  flex-direction: column;
  align-items: baseline;
`;

export const FlexCenterSpaceBetween = styled.span`
  display: flex !important;
  align-items: center !important;
  justify-content: space-between;
  padding-bottom: ${({ paddingBottom }) =>
    paddingBottom ? paddingBottom : ""};
  padding-top: ${({ paddingTop }) => (paddingTop ? paddingTop : "")};
  height: ${({ flexHeight }) => (flexHeight ? flexHeight : "")};
  padding: ${({ $padding }) => ($padding ? $padding : "")};
`;
export const FlexSpaceBetween = styled.span`
  display: flex !important;
  justify-content: space-between;
  align-items: ${({ $alignItems }) => ($alignItems ? $alignItems : "")};
`;

export const FlexColumnSpaceBetween = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const FlexCenterCenter = styled.span`
  display: flex !important;
  align-items: center;
  justify-content: center;
`;

export const FlexJustifyCenter = styled.span`
  display: flex !important;
  justify-content: center;
`;
export const FlexCenter = styled.span`
  display: flex !important;
  align-items: center;
`;

export const FlexEnd = styled.span`
  display: flex !important;
  align-items: flex-end;
`;

export const FlexEndCenter = styled.span`
  display: flex !important;
  align-items: flex-end;
  justify-content: center;
`;

export const FlexCenterEnd = styled.span`
  display: flex !important;
  align-items: center;
  justify-content: flex-end;
`;

export const FlexColumnCenterSpaceBetween = styled(FlexCenterSpaceBetween)`
  flex-direction: column;
  align-items: flex-start !important;
  padding: 1rem;
`;

export const FlexStart = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-bottom: 2rem;
`;
