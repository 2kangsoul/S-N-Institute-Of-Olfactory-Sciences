import { createTheme } from '@mui/material/styles';

// Desain Dasar
import palette from './palette';
import typography from './typography';
import customShadows from './shadows';

// Komponen UI Dasar (Aman & Wajib agar tampilan rapi)
import Button from "../theme/components/button/Button";
import ButtonBase from "../theme/components/button/ButtonBase";
import IconButton from "../theme/components/button/IconButton";
import Toolbar from "../theme/components/button/Toolbar";
import Stack from "../theme/components/layout/Stack";
import Paper from "../theme/components/surface/Paper";
import Checkbox from "../theme/components/input/Checkbox";
import InputBase from "../theme/components/input/InputBase";
import FilledInput from "../theme/components/input/FilledInput";
import InputAdornment from "../theme/components/input/InputAdornment";
import FormControlLabel from "../theme/components/input/FormControlLabel";
import OutlinedInput from "../theme/components/input/OutlinedInput";
import TextField from "../theme/components/input/TextField";
import Drawer from "../theme/components/navigation/Drawer";
import Divider from "../theme/components/data-display/Divider";
import Chip from "../theme/components/data-display/Chip";
import Link from "../theme/components/navigation/Link";
import List from "../theme/components/list/List";
import ListItemButton from "../theme/components/list/ListItemButton";
import ListItemIcon from "../theme/components/list/ListItemIcon";
import ListItemText from"../theme/components/list/ListItemText";
import MenuItem from "../theme/components/list/MenuItem";
import Collapse from "../theme/components/list/Collapse";

// ----------------------------------------------------------------------
// KOMPONEN "TERSANGKA" ERROR KITA NONAKTIFKAN SEMENTARA:
// Jika butuh DataGrid/Kalender ke depannya, pastikan library @mui/x-data-grid 
// dan @mui/x-date-pickers sudah di-install via npm.
// ----------------------------------------------------------------------
// import CssBaseline from './components/utils/CssBaseline';
// import DataGrid from './components/data-grid/DataGrid';
// import MonthCalendar from './components/date-picker/MonthCalendar';
// import YearCalendar from './components/date-picker/YearCalendar';
// import PaginationItem from './components/pagination/PaginationItem';
// import type {} from '@mui/x-data-grid/themeAugmentation';
// import type {} from '@mui/x-date-pickers/themeAugmentation';

export const theme = createTheme({
  typography,
  palette,
  components: {
    // Kita aktifkan semua komponen UI dasar yang aman
    MuiStack: Stack,
    MuiPaper: Paper,
    MuiButton: Button,
    MuiButtonBase: ButtonBase,
    MuiIconButton: IconButton,
    MuiToolbar: Toolbar,
    MuiCheckbox: Checkbox,
    MuiFilledInput: FilledInput,
    MuiFormControlLabel: FormControlLabel,
    MuiInputAdornment: InputAdornment,
    MuiInputBase: InputBase,
    MuiOutlinedInput: OutlinedInput,
    MuiTextField: TextField,
    MuiDrawer: Drawer,
    MuiDivider: Divider,
    MuiChip: Chip,
    MuiLink: Link,
    MuiList: List,
    MuiListItemButton: ListItemButton,
    MuiListItemIcon: ListItemIcon,
    MuiListItemText: ListItemText,
    MuiMenuItem: MenuItem,
    MuiCollapse: Collapse,
  },
  customShadows,
  spacing: 8,
} as any);