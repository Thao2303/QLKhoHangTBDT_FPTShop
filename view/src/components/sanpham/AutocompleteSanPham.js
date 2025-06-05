import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const AutocompleteSanPham = ({ value, onChange, options, onThemMoi }) => {
    const handleChange = (event, newValue) => {
        if (newValue === "➕ Thêm sản phẩm mới") {
            onThemMoi();
        } else {
            onChange(newValue);
        }
    };

    return (
        <Autocomplete
            freeSolo
            value={value}
            options={[...options.map(p => p.tenSanPham), "➕ Thêm sản phẩm mới"]}
            onChange={handleChange}
            onInputChange={(e, newInput) => onChange(newInput)}
            renderInput={(params) => <TextField {...params} label="Sản phẩm" />}
        />
    );
};

export default AutocompleteSanPham;
