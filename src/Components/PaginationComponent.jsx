
import React, { memo } from "react";
import {
    Box,
    Pagination
} from "@mui/material";

const PaginationComponent = memo(({ page, onPageChange }) => (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <Pagination
            count={10}
            page={page}
            onChange={onPageChange}
            color="primary"
            sx={{
                "& .MuiPaginationItem-root": {
                    color: "#424242",
                    "&.Mui-selected": {
                        backgroundColor: "#424242",
                        color: "#FFFFFF",
                        "&:hover": {
                            backgroundColor: "#2C2C2C",
                        },
                    },
                },
            }}
        />
    </Box>
));

export default PaginationComponent;
