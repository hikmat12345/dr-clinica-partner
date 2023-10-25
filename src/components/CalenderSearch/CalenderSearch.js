import React from 'react';

import { flavourOptions } from '../data';
import Select from 'react-select';

export default () => (
  <Select
    defaultValue={flavourOptions[2]}
    options={flavourOptions}
    theme={(theme) => ({
      ...theme,
      borderRadius: 0,
      colors: {
        ...theme.colors,
        primary25: 'hotpink',
        primary: 'black',
      },
    })}
  />
);



<button
style={{
  textAlign: 'left',
  marginRight: 'auto',
  display: 'block',
  fontSize: '17px',
  marginTop: '20px',
  backgroundColor: 'white',
  padding: '10px 18px',
  borderRadius: '12px',
  border: '1px solid',
}}
onClick={this.CalenderEventHandler}
>
<span style={{ borderBottom: 'none' }}> Search by Date : </span>{' '}
<span style={{ borderBottom: '1px solid' }}>
  {selectedDateValue !== ''
    ? format(selectedDateValue, 'PP')
    : this.currentDateSelection}
</span>
{/* {Date().getDay() +
  '-' +
  Date().getMonth() +
  '-' +
  Date().getFullYear()} */}
</button>
{showCalender ? (
<div className="calender-wraper">
  <CustomDatePicker
    selectedDate={selectedDateValue}
    setSelectedDate={this.changeSelectedDate}
  />
</div>
) : (
''
)}