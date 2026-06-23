import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext.jsx';

function useTheme() {
  return useContext(ThemeContext);
}

export default useTheme;
