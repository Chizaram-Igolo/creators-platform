import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
body {
    background:${({ theme }) => theme.body};
    color:${({ theme }) => theme.text};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}`;

export default GlobalStyles;
