import React, { useState, useEffect } from 'react';
import { useComboBoxState } from '@react-stately/combobox';
import { useComboBox } from '@react-aria/combobox';
import { useButton } from '@react-aria/button';
import { OverlayContainer } from '@react-aria/overlays';
import { useListBox, useOption } from '@react-aria/listbox';
import { Item } from '@react-stately/collections';
import styles from '../Combobox.module.css';

import { Key } from 'react';

type ComboboxProps = {
  label: string;
  placeholder: string;
  items: { value: string }[]; // Update the type of 'items' to include an object with a 'value' property
  onSelection: (selection: Key | null) => void;
};

const Combobox: React.FC<ComboboxProps> = ({ label, placeholder, items, onSelection }) => {
  const [inputValue, setInputValue] = useState('');
  const state = useComboBoxState({
    items,
    onSelectionChange: onSelection,
    defaultFilter: (item, inputValue) =>
      item.toLowerCase().includes(inputValue.toLowerCase()),
  });

  const ref = React.useRef<HTMLButtonElement | null>(null);
  
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const listBoxRef = React.useRef<HTMLUListElement | null>(null);

  const { inputProps, listBoxProps, labelProps } = useComboBox({
    inputRef,
    popoverRef,
    listBoxRef,
    label,
    inputValue,
    onInputChange: setInputValue,
    onSelectionChange: state.setSelectedKey,
    items,
  }, state);
  const { buttonProps } = useButton({ onPress: () => state.open() }, ref);

  return (
    <div className={styles.comboboxContainer}>
      <label {...labelProps} className={styles.label}>{label}</label>
      <div className={styles.inputContainer}>
        <input {...inputProps} placeholder={placeholder} className={styles.input} />
        <button {...buttonProps} className={styles.button}>⌄</button>
      </div>
      {state.isOpen && (
        <OverlayContainer>
          <ListBox {...listBoxProps} state={state} />
        </OverlayContainer>
      )}
    </div>
  );
};

const ListBox = ({ state, ...props }: { state: any }) => {
  const ref = React.useRef(null);
  const { listBoxProps } = useListBox(props, state, ref);

  return (
    <ul {...listBoxProps} ref={ref} className={styles.listBox}>
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
};

const Option = ({ item, state }: { item: any, state: any }) => {
  const ref = React.useRef(null);
  const { optionProps, isSelected, isFocused } = useOption({ key: item.key }, state, ref);

  return (
    <li
      {...optionProps}
      ref={ref}
      className={`${styles.option} ${isFocused ? styles.focused : ''} ${isSelected ? styles.selected : ''}`}
    >
      {item.rendered}
    </li>
  );
};

export default Combobox;
