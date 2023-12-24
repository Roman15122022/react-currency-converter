import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import {useDebounce} from "../hooks/useDebounce";

let newDataMap = {};
const URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
const MyInput = () => {
    const [valueUAH, setValueUAH] = useState('');
    const [options, setOptions] = useState({ variant: 'contained', color: 'success', error: false });
    const [currency, setCurrency] = useState('EUR');
    const [arrValue, setArrValue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [finallyValue, setFinallyValue] = useState('');
    const [nameCur, setNameCur] = useState('');

    const verification = useDebounce(() =>{
        if (Number.isNaN(Number(valueUAH))) {
            setOptions({
                variant: 'outlined',
                color: 'error',
                error: true,
            });
        } else {
            setOptions({ variant: 'contained', color: 'success', error: false });
        }
    },500)
    const handleClick = () => {
        if (options.error) return;
        let course = newDataMap[currency];
        let answer = Number(valueUAH) / Number(course[0]);
        setNameCur(course[1]);
        setFinallyValue(answer.toFixed(2));
    }

    const handleChange = (event) => {
        setValueUAH(event.target.value);
    }

    useEffect(() => {
        verification();
    }, [valueUAH])

    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await axios.get(URL);
                const data = await response.data;
                newDataMap = data.reduce((memo, item) => {
                    const cc = item.cc;
                    const rate = item.rate;
                    const txt = item.txt;
                    memo[cc] = [rate, txt];
                    return memo;
                }, {});
                const currencies = Object.keys(newDataMap);
                setArrValue(currencies);
                setLoading(false);
            } catch (error) {
                console.error('Error', error);
                setLoading(false);
            }
        };
        fetching();
    }, [])

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='flex items-center'>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        error={options.error}
                        color='success'
                        onChange={handleChange}
                        value={valueUAH}
                        id="outlined-error"
                        label="Enter (UAH)"
                    />
                </Box>
                <div>⇨</div>
                {loading ? (
                    <p>Loading currencies...</p>
                ) : (
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">C</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={currency}
                            label="$"
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            {arrValue.map((value) => (
                                <MenuItem key={value} value={value}>{value}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </div>
            <div className='my-5 text-4xl'>⇅</div>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '34ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    disabled
                    error={options.error}
                    color='success'
                    value={finallyValue}
                    id="outlined-error"
                    helperText={options.error ? 'For example, "42.56"' : nameCur}
                    label={"I'll get " + '(' + currency + ')'}
                />
            </Box>
            <Button onClick={handleClick} variant={options.variant} color={options.color}>convert</Button>
        </div>
    );
};

export default MyInput;
