import React, {useEffect, useState} from 'react';
import {Box, Button, TextField} from "@mui/material";
import axios from "axios";

const MyInput = () => {
    const [value, setValue] = useState('');
    const [options, setOptions] = useState({variant: 'contained', color: 'success', error: false})

    const handleClick = async () => {
        if (options.error) return;
        const response = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        console.log(response.data);
    }

    const handleChange = (event) => {
        setValue(event.target.value);
    }
    useEffect(() => {
        if (Number.isNaN(Number(value))) {
            setOptions({
                variant: 'outlined',
                color: 'error',
                error: true,
            });
        } else {
            setOptions({variant: 'contained', color: 'success', error: false});
        }
    }, [value])

    return (
        <div className='text-center'>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': {m: 1, width: '25ch'},
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <TextField
                        error={options.error}
                        color='success'
                        onChange={handleChange}
                        value={value}
                        id="outlined-error"
                        label="Enter (UAH)"
                        helperText={options.error ? 'The amount entered must be in numeric format with a decimal point. For example, "42.56"' : ''}
                    />
                </div>
            </Box>
            <Button onClick={handleClick} variant={options.variant} color={options.color}>convert</Button>
        </div>
    );
};

export default MyInput;
