import React from "react";
import { ButtonWrapper, CustomButton } from "./button.style";

const Button = (props) => {
  const {
    children,
    onClick,
    disabled,
    loading,
    type,
    htmlType,
    style,
    color = "primary",
    variant = "contained",
    $width,
    $height,
    $position,
    $bottom,
    $background,
    $color,
    border,
    ...rest
  } = props;
  return (
    <ButtonWrapper>
      <CustomButton
        disableElevation
        onClick={onClick}
        $disabled={disabled}
        type={htmlType}
        $buttonType={type}
        $color={color}
        variant={variant}
        style={style}
        disableRipple={disabled}
        $width={$width}
        $height={$height}
        $position={$position}
        $bottom={$bottom}
        $background={$background}
        $border={border}
        {...rest}
      >
        {children}
      </CustomButton>
    </ButtonWrapper>
  );
};

export default Button;
