import React from "react";
import { Pagination, Stack } from "@mui/material";

const pagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => onPageChange(value)}
        color="primary"
        size="large"
        variant="outlined"
        shape="rounded"
      />
    </Stack>
  );
};

export default pagination;