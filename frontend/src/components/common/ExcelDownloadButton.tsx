import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { exportToExcel } from '../../utils/exportToExcel';

interface ExcelDownloadButtonProps<T> {
  data: T[];
  fileName: string;
  sheetName?: string;
  label?: string;
}

export function ExcelDownloadButton<T>({ data, fileName, sheetName, label }: ExcelDownloadButtonProps<T>) {
  return (
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={() => exportToExcel(data, fileName, sheetName)}
      sx={{ ml: 1 }}
    >
      {label || '엑셀 다운로드'}
    </Button>
  );
} 