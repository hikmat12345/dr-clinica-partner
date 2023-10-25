import React, { PropsWithChildren } from "react";
import {
  SemiBoldButton,
  BoldH1,
  SemiBoldH1,
  MediumH2,
  MediumH3,
  MediumH4,
  MediumH5,
  RegularH6,
  MediumH6,
  RegularP,
  RegularBody,
  MediumP,
  Label,
  NormalBody,
  MediumSmall,
  AlertNormal,
  MediumH7,
  BoldH2,
  ParcelSmall,
  LabelP,
  SelectBarcode,
  MediumH8,
  MediumH9,
} from "./typography.style";


const Typography = (props) => {
  const {
    id,
    type,
    weight,
    children,
    className,
    color ,
    backgroundColor,
    textAlign,
    paddingLeft,
    center
  } = props;

  const getType = () => {
    if (type === "button" && weight === "semiBold") {
      return (
        <SemiBoldButton
          color={color}
          id={id}
          className={`${className} typography-x`}
        >
          {children}
        </SemiBoldButton>
      );
    }
    if (type === "h1" && weight === "bold") {
      return <BoldH1>{children}</BoldH1>;
    }
    if (type === "h1" && weight === "semiBold") {
      return (
        <SemiBoldH1 id={id} className={`${className} typography-x`} color = {color} center = {center}>
          {children}
        </SemiBoldH1>
      );
    }
    if (type === "p2" && weight === "normal") {
      return (
        <LabelP id={id} className={`${className} typography-x`} color={color} center = {center}>
          {children}
        </LabelP>
      );
    }
    if (type === "small" && weight === "medium") {
      return (
        <MediumSmall
          id={id}
          className={`${className} typography-x`}
          color={color}
          paddingLeft = {paddingLeft}
        >
          {children}
        </MediumSmall>
      );
    }
    if (type === "barcode" && weight === "medium") {
      return (
        <SelectBarcode id={id} className={`${className} typography-x`}>
          {children}
        </SelectBarcode>
      );
    }
    if (type === "h2" && weight === "bold") {
      return (
        <BoldH2 id={id} className={`${className} typography-x`}>
          {children}
        </BoldH2>
      );
    }
    if (type === "h2" && weight === "medium") {
      return (
        <MediumH2 id={id} className={`${className} typography-x`}>
          {children}
        </MediumH2>
      );
    }
    if (type === "h3" && weight === "medium") {
      return (
        <MediumH3 id={id} className={`${className} typography-x`}>
          {children}
        </MediumH3>
      );
    }
    if (type === "h4" && weight === "medium") {
      return (
        <MediumH4 color={color} id={id} className={`${className} typography-x`}>
          {children}
        </MediumH4>
      );
    }
    if (type === "h5" && weight === "medium") {
      return (
        <MediumH5 id={id} color={color} className={`${className} typography-x`}>
          {children}
        </MediumH5>
      );
    }
    if (type === "h6" && weight === "regular") {
      return (
        <RegularH6
          color={color}
          id={id}
          className={`${className} typography-x`}
        >
          {children}
        </RegularH6>
      );
    }
    if (type === "h9" && weight === "regular") {
      return (
        <MediumH9 color={color} id={id} className={`${className} typography-x`}>
          {children}
        </MediumH9>
      );
    }
    if (type === "h6" && weight === "medium") {
      return (
        <MediumH6 color={color} id={id} className={`${className} typography-x`}>
          {children}
        </MediumH6>
      );
    }
    if (type === "h8" && weight === "medium") {
      return (
        <MediumH8 color={color} id={id} className={`${className} typography-x`}>
          {children}
        </MediumH8>
      );
    }

    if (type === "h7" && weight === "medium") {
      return (
        <MediumH7 color={color} id={id} className={`${className} typography-x`}>
          {children}
        </MediumH7>
      );
    }
    if (type === "body" && weight === "regular") {
      return (
        <RegularBody id={id} className={`${className} typography-x`}>
          {children}
        </RegularBody>
      );
    }
    if (type === "body" && weight === "normal") {
      return (
        <NormalBody id={id} className={`${className} typography-x`}>
          {children}
        </NormalBody>
      );
    }
    if (type === "p" && weight === "regular") {
      return (
        <RegularP id={id} className={`${className} typography-x`}>
          {children}
        </RegularP>
      );
    }
    if (type === "p" && weight === "medium") {
      return (
        <MediumP id={id} className={`${className} typography-x`} color={color} $textAlign={textAlign}>
          {children}
        </MediumP>
      );
    }
    if (type === "parcel" && weight === "medium") {
      return (
        <ParcelSmall
          id={id}
          className={`${className} typography-x`}
          $backgroundColor={backgroundColor}
          color={color}
        >
          {children}
        </ParcelSmall>
      );
    }
    if (type === "label") {
      return (
        <Label id={id} className={`${className} typography-x`}>
          {children}
        </Label>
      );
    }
    if (type === "alert" && weight === "normal") {
      return (
        <AlertNormal id={id} className={`${className} typography-x`}>
          {children}
        </AlertNormal>
      );
    }
    return (
      <RegularP id={id} className={`${className} typography`}>
        {children}
      </RegularP>
    );
  };

  return <>{getType(props)}</>;
};

export default Typography;
