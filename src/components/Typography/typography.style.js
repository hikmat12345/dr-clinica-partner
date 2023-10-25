import styled, { css } from "styled-components";


const headingShared = () => css`
  font-style: normal;
  color: ${({ theme, color }) => (color ? color : theme.primaryTextColor)};
  white-space: pre-wrap;
  margin-bottom: 0rem;
  .ant-btn-link {
    &:hover {
      span {
        text-decoration: underline;
      }
    }
  }
`;

export const SemiBoldButton = styled.span`
  ${headingShared};
  font-family: Inter;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.375rem;
`;
export const BoldH1 = styled.h1`
  ${headingShared}
  display : flex;
  justify-content: center;
  font-family: Inter;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.375rem;
  padding-bottom: 0.5rem;
  text-align : center;
  align-items : center;
`;

export const SemiBoldH1 = styled.h1`
  ${headingShared};
  display : flex;
  justify-content: ${center => center.center ? center : ""};
  color : ${color => color ? color : ""}
  font-weight: 600;
  font-size: 1rem;
  /* text-transform: capitalize; */
`;

export const BoldH2 = styled.h2`
  ${headingShared};
  font-family: Inter;
  font-weight: 700;
  font-size: 3rem;
  line-height: 4.188rem;
`;

export const MediumH2 = styled.h2`
  ${headingShared};
  font-family: Inter;
  font-weight: 500;
  font-size: 3rem;
  line-height: 4.188rem;
  /* text-transform: capitalize; */
`;

export const MediumH3 = styled.h3`
  ${headingShared};
  font-family: Inter;
  font-weight: 700;
  font-size: 2.375rem;
  line-height: 1.5rem;
`;

export const MediumH4 = styled.h4`
  ${headingShared};
  font-family: Inter;
  font-weight: 500;
  font-size: 2rem;
  line-height: 2.813rem;
  /* text-transform: capitalize; */
`;

export const MediumH5 = styled.h5`
  ${headingShared};
  font-family: Inter;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 2.125rem;
  color: ${({ theme, color }) => (color ? color : theme.white)};

  /* text-transform: capitalize; */
`;

export const RegularH6 = styled.h6`
  ${headingShared};
  font-family: Inter;
  font-weight: ${({ color }) => (color === "#6C5DD3" ? "600" : "400")};
  font-size: 1.25rem;
  line-height: 1.75rem;
`;

export const MediumH6 = styled.h6`
  ${headingShared};
  font-family: Inter;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
`;

export const MediumH8 = styled.h6`
  ${headingShared};
  font-family: Inter;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
`;

export const MediumH7 = styled.h6`
  ${headingShared};
  font-family: Inter;
  font-weight: 700;
  font-size: 0.8rem;
  line-height: 1.5rem;
`;

export const MediumH9 = styled.h6`
  ${headingShared};
  font-family: Inter;
  font-weight: 600;
  font-size: 0.8rem;
  line-height: 1.5rem;
`;
const SharedStyles = css`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.375rem;
  color: ${({ theme }) => theme.slateGrayColor};
`;

export const MediumSmall = styled.p`
  ${SharedStyles};
  font-weight: 500;
  font-size: 0.75rem;
  color: ${({color }) =>
    color ? color : "orange"};
    padding-left : ${props => props.paddingLeft ? "1rem" : "0rem"};
`;
export const SelectBarcode = styled(MediumSmall)`
color : white;
align-items : center;
margin-bottom : 0px;
`

export const RegularBody = styled.span`
  ${SharedStyles}
`;

export const NormalBody = styled.span`
  ${SharedStyles}
  font-weight: 500;
  color: ${({ theme }) => theme.bodyNormalColor};
`;

export const RegularP = styled.p`
  ${SharedStyles}
  color: ${({ theme }) => theme.primaryTextColor};
`;

export const MediumP = styled.p`
  display: flex;
  justify-content: center;
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.375rem;
  color: ${({ theme, color }) =>
    color ? theme.quaternaryGray : theme.primaryTextColor};
    text-align : ${({$textAlign})=> $textAlign ? $textAlign : ''};
`;

export const Label = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1rem;
  color: ${({ theme }) => theme.slateGrayColor};
  margin: 0;
`;
export const LabelP = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 0.87rem;
  line-height: 1.37rem;
  color: ${({ theme, color }) => (color ? color : theme.gray)};
  margin: 0;
  display: inline-block;
  padding-right: 1rem;
`;

export const AlertNormal = styled.span`
  ${SharedStyles};
  font-size: 0.9rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.bodyNormalColor};
  margin: 0;
`;
export const ParcelSmall = styled.p`
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1.5rem;
  color: ${({ theme, color }) => (color ? color : theme.white)} !important;
  background: ${({ theme, $backgroundColor }) =>
    $backgroundColor ? $backgroundColor : theme.secondaryOrange};
  border-radius: ${({ theme }) => theme.borderRadiusMedium};
  padding: 0.25rem 1rem 0.25rem 1rem;
`;
