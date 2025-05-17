
import React, { memo } from "react";
import {
    Box,
    Select,
    MenuItem
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";

const SortSection = memo(({ sortBy, onSortChange }) => (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <SortIcon sx={{ color: "#757575", mr: 1 }} />
            <Select
                value={sortBy}
                onChange={onSortChange}
                size="small"
                sx={{
                    minWidth: 200,
                    backgroundColor: "#FFFFFF",
                    "& .MuiSelect-select": {
                        py: 1,
                    },
                }}
            >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
            </Select>
        </Box>
    </Box>
));

export default SortSection;
