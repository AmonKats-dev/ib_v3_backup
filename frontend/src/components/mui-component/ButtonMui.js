// ButtonMui.js
import React from 'react';
import { Button, CircularProgress } from '@mui/material';

const ButtonMui = ({ children, loading = false, ...restProps }) => {
  return (
    <Button
      {...restProps}
      disabled={loading || restProps.disabled}
      sx={{
        backgroundColor: 'rgb(255, 217, 151)',
        color: 'black',
        textTransform: 'none',
        borderRadius: '8px',
        px: 2,
        py: 1,
        gap: 1,
        '&:hover': {
          backgroundColor: 'rgb(255, 217, 151)'
        },
        '&:active': {
          backgroundColor: 'rgba(255, 217, 151, 0.7)'
        },
        '&.Mui-disabled': {
          backgroundColor: 'rgba(255, 217, 151, 0.6)',
          color: 'rgba(0,0,0,0.6)'
        },
        ...(restProps.sx || {})
      }}
    >
      {loading && <CircularProgress size={18} thickness={5} color="inherit" />}
      {children}
    </Button>
  );
};

export default ButtonMui;
