import React from 'react';
import { TextField, useTheme } from '@mui/material';

function FormField({
    name,
    label,
    placeholder,
    type = 'text',
    register,
    error,
    helperText,
    autoComplete,
    validationRules
}) {
    const theme = useTheme();
    const fieldName = name || label.toLowerCase().replace(/\s/g, '');

    return (
        <TextField
            fullWidth
            label={label}
            placeholder={placeholder}
            type={type}
            autoComplete={autoComplete}
            error={!!error}
            helperText={helperText}
            {...register(fieldName, validationRules)}
            InputProps={{
                sx: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.custom.highlight,
                    },
                    '&.Mui-focused .MuiInputBase-input': {
                        color: theme.palette.custom.highlight,
                    },
                },
            }}
            InputLabelProps={{
                sx: {
                    '&.Mui-focused': {
                        color: theme.palette.custom.highlight,
                    },
                },
            }}
        />
    );
}

export default FormField;
