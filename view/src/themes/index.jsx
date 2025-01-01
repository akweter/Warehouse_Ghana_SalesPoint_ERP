import { createTheme } from '@mui/material/styles';

// assets
import colors from '../assets/scss/_themes-vars.module.scss';


// project imports
import componentStyleOverrides from './compStyleOverride';
import themePalette from './palette';
import themeTypography from './typography';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
  const color = colors;
  const paletteMode = customization.theme === 'dark' ? 'dark' : 'light';

  const themeOption = {
    colors: color,
    mode: paletteMode,
    heading: paletteMode === 'dark' ? color.darkTextTitle : color.grey900,
    paper: paletteMode === 'dark' ? color.darkPaper : color.paper,
    backgroundDefault: paletteMode === 'dark' ? color.darkBackground : color.paper,
    background: paletteMode === 'dark' ? color.darkPrimaryLight : color.primaryLight,
    darkTextPrimary: paletteMode === 'dark' ? color.darkTextPrimary : color.grey700,
    darkTextSecondary: paletteMode === 'dark' ? color.darkTextSecondary : color.grey500,
    textDark: paletteMode === 'dark' ? color.grey100 : color.grey900,
    menuSelected: paletteMode === 'dark' ? color.darkPrimaryDark : color.secondaryDark,
    menuSelectedBack: paletteMode === 'dark' ? color.darkSecondaryLight : color.secondaryLight,
    divider: paletteMode === 'dark' ? color.grey800 : color.grey200,
    customization
};

  const themeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption)
  };

  const themes = createTheme(themeOptions);
  themes.components = componentStyleOverrides(themeOption);

  return themes;
};

export default theme;
