import React from "react";
import { render, Printer, Text } from 'react-thermal-printer';
export class ComponentToPrint extends React.PureComponent {
    render() {
      return (
        <Printer type="epson">
        <Text>Hello World</Text>
        </Printer>
      );
    }
}