import React, { useState } from "react";

export default function InputCurrency(props) {
  const [text, setText] = useState("");
  const [value, setValue] = useState(0);

  function format(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  function getRealValue(x) {
    return x.toString().replace(/,/g, "");
  }

  return (
    <input
      {...props}
      value={text}
      onChange={(event) => {
        const val = event.currentTarget.value;
        const x = getRealValue(val);
        setText(format(x));
        setValue(x);
        if (props.onChange) {
          const event = { value: x }
          props.onChange(event);
        }
      }}
    />
  );
}
