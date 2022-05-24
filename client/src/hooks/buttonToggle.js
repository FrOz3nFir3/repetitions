import { useCallback, useState } from 'react';

// Parameter is the boolean, with default "false" value
export const useButtonToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = useState(initialState);

  // Define and memorize toggler function in case we pass down the component,
  // This function change the boolean value to it's opposite value
  function changeState() {
    setState((state)=>!state)
  }
  const toggle = useCallback(changeState, []);

  return [state, toggle]
}