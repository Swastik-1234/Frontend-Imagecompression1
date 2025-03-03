// import React, { useState } from 'react';
// import {
//   Button,
//   Box,
//   Typography,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Alert,
//   TextField
// } from '@mui/material';
// import axios from 'axios';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [webhookUrl, setWebhookUrl] = useState('');
//   const [results, setResults] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const API_BASE_URL = 'https://imagecompressor-production-db2d.up.railway.app';

//   const formatFileSize = (bytes) => {
//     if (!bytes || bytes < 0) return 'N/A';
//     if (bytes === 0) return '0 KB';
//     return `${parseFloat(bytes).toFixed(2)} KB`;
//   };

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//     setError(null);
//   };

//   const handleWebhookChange = (event) => {
//     setWebhookUrl(event.target.value);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError('Please select a file');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('file', file);
//     if (webhookUrl) {
//       formData.append('webhookUrl', webhookUrl);
//     }

//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/upload`, formData);
//       console.log('Server response:', response.data);
      
//       const transformedData = {
//         message: response.data.message,
//         products: response.data.data.map(item => ({
//           'Sl No': item['Sl No'],
//           'Product Name': item['Product Name'],
//           'Input Image Urls': Array.isArray(item['Input Image Urls']) 
//             ? item['Input Image Urls'] 
//             : [item['Input image Urls']],
//           'Output Image Urls': Array.isArray(item['Output Image Urls'])
//             ? item['Output Image Urls']
//             : item['Output Image Urls'] ? [item['Output Image Urls']] : [],
//           'originalSizes': Array.isArray(item['originalSizes'])
//             ? item['originalSizes']
//             : [item.originalSize || 0],
//           'compressedSizes': Array.isArray(item['compressedSizes'])
//             ? item['compressedSizes']
//             : [item.compressedSize || 0],
//           'compressionRatios': Array.isArray(item['compressionRatios'])
//             ? item['compressionRatios']
//             : [item.compressionRatio || 0]
//         }))
//       };

//       console.log('Transformed data:', transformedData);
//       setResults(transformedData);
//     } catch (err) {
//       console.error('Upload error:', err);
//       setError('Upload failed: ' + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getImageUrl = (url) => {
//     if (!url) return '/placeholder.jpg';
//     if (url.startsWith('data:') || url.startsWith('http')) return url;
//     return `${API_BASE_URL}${url}`;
//   };

//   return (
//     <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Image Processing System
//       </Typography>

//       <Box sx={{ mb: 3 }}>
//         <input
//           accept=".csv"
//           style={{ display: 'none' }}
//           id="raised-button-file"
//           type="file"
//           onChange={handleFileChange}
//         />
//         <label htmlFor="raised-button-file">
//           <Button variant="contained" component="span" sx={{ mr: 2 }}>
//             Select CSV File
//           </Button>
//         </label>
//         {file && (
//           <Typography component="span">
//             Selected: {file.name}
//           </Typography>
//         )}
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <TextField
//           fullWidth
//           label="Webhook URL (Optional)"
//           variant="outlined"
//           value={webhookUrl}
//           onChange={handleWebhookChange}
//           placeholder="Enter webhook URL for notifications"
//           sx={{ mb: 2 }}
//         />
//       </Box>

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleUpload}
//         disabled={!file || loading}
//         sx={{ mb: 3 }}
//       >
//         Upload and Process
//       </Button>

//       {loading && (
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <CircularProgress size={24} sx={{ mr: 1 }} />
//           <Typography>Processing...</Typography>
//         </Box>
//       )}

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {results && results.products && (
//         <TableContainer component={Paper} sx={{ mt: 3 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Sl No</TableCell>
//                 <TableCell>Product Name</TableCell>
//                 <TableCell>Original Image</TableCell>
//                 <TableCell>Compressed Image</TableCell>
//                 <TableCell>Original Size</TableCell>
//                 <TableCell>Compressed Size</TableCell>
//                 <TableCell>Compression Ratio</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {results.products.map((product, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{product['Sl No']}</TableCell>
//                   <TableCell>{product['Product Name']}</TableCell>
//                   <TableCell>
//                     {(product['Input Image Urls'] || []).map((url, i) => (
//                       <Box key={i} sx={{ mb: 1 }}>
//                         <img 
//                           src={getImageUrl(url)}
//                           alt={`Original ${i+1}`} 
//                           style={{ maxWidth: '100px', height: 'auto' }}
//                           onError={(e) => {
//                             console.error('Error loading image:', url);
//                             e.target.src = '/placeholder.jpg';
//                           }}
//                         />
//                       </Box>
//                     ))}
//                   </TableCell>
//                   <TableCell>
//                     {(product['Output Image Urls'] || []).map((url, i) => {
//                       console.log('Output Image URL:', url);
//                       return (
//                         <Box key={i} sx={{ mb: 1 }}>
//                           {url ? (
//                             <img 
//                               src={url}
//                               alt={`Compressed ${i+1}`} 
//                               style={{ maxWidth: '100px', height: 'auto' }}
//                               onError={(e) => {
//                                 console.error('Error loading compressed image:', url);
//                                 e.target.src = '/placeholder.jpg';
//                               }}
//                             />
//                           ) : (
//                             <Typography color="error">
//                               Compression failed
//                             </Typography>
//                           )}
//                         </Box>
//                       );
//                     })}
//                   </TableCell>
//                   <TableCell>
//                     {formatFileSize(product.originalSizes?.[0])}
//                   </TableCell>
//                   <TableCell>
//                     {formatFileSize(product.compressedSizes?.[0])}
//                   </TableCell>
//                   <TableCell>
//                     {`${product.compressionRatios?.[0] || 0}%`}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default FileUpload;
import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  TextField
} from '@mui/material';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Change this to your local backend URL
  const API_BASE_URL = 'http://localhost:3001';
  // const API_BASE_URL = 'https://imagecompressor-production-db2d.up.railway.app'; // Production URL

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleWebhookChange = (event) => {
    setWebhookUrl(event.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (webhookUrl) {
      formData.append('webhookUrl', webhookUrl);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData);
      console.log('Server response:', response.data);

      if (response.data.data) {
        setResults({
          message: response.data.message,
          products: response.data.data
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to process images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Image Compression System
      </Typography>

      <Box sx={{ mb: 3 }}>
        <input
          accept=".csv"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" sx={{ mr: 2 }}>
            Select CSV File
          </Button>
        </label>
        {file && (
          <Typography component="span">
            Selected: {file.name}
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Webhook URL (Optional)"
          variant="outlined"
          value={webhookUrl}
          onChange={handleWebhookChange}
          placeholder="Enter webhook URL for notifications"
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || loading}
        sx={{ mb: 3 }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
            Processing...
          </Box>
        ) : (
          'Upload and Process'
        )}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {results?.products && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sl No</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Original Image</TableCell>
                <TableCell>Compressed Image</TableCell>
                <TableCell>Original Size</TableCell>
                <TableCell>Compressed Size</TableCell>
                <TableCell>Compression Ratio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product['Sl No']}</TableCell>
                  <TableCell>{product['Product Name']}</TableCell>
                  <TableCell>
                    {product['Input Image Urls']?.map((url, i) => (
                      <Box key={i} sx={{ mb: 1 }}>
                        <img
                          src={url}
                          alt={`Original ${i+1}`}
                          style={{ maxWidth: '100px', height: 'auto' }}
                          onError={(e) => {
                            console.error('Error loading original image:', url);
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell>
                    {product['Output Image Urls']?.map((url, i) => (
                      <Box key={i} sx={{ mb: 1 }}>
                        {url ? (
                          <img
                            src={url}
                            alt={`Compressed ${i+1}`}
                            style={{ maxWidth: '100px', height: 'auto' }}
                            onError={(e) => {
                              console.error('Error loading compressed image');
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <Typography color="error">
                            Compression failed
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell>{formatFileSize(product.originalSizes?.[0])}</TableCell>
                  <TableCell>{formatFileSize(product.compressedSizes?.[0])}</TableCell>
                  <TableCell>{`${product.compressionRatios?.[0] || 0}%`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FileUpload;