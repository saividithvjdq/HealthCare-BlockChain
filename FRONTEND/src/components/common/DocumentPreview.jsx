import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DocumentPreview = ({ open, handleClose, fileUrl, fileName }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {fileName}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ height: '70vh', width: '100%' }}>
          {fileUrl && (
            <iframe
              src={fileUrl}
              width="100%"
              height="100%"
              title="Document Preview"
              style={{ border: 'none' }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;