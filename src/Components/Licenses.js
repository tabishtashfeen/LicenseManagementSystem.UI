import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import api from "../Services/api";

export default function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const fetchLicenses = async () => {
      const res = await api.get("/License/GetAllLicenses");
      if (res.data.success) {
        setLicenses(res.data.result);
      }
    };

    const fetchUsers = async () => {
      const res = await api.get("/Users/GetAllUsers");
      if (res.data.success) {
        setUsers(res.data.result);
      }
    };

    const fetchProducts = async () => {
      const res = await api.get("/products/GetAllProducts");
      if (res.data.success) {
        setProducts(res.data.result);
      }
    };

    fetchLicenses();
    fetchUsers();
    fetchProducts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value);
  };

  const handleProductChange = (event) => {
    setSelectedProductId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedUserId) {
      alert("Please enter a User.");
      return;
    }
    if (!selectedProductId) {
      alert("Please enter a Product.");
      return;
    }
    const newLicense = {
      userId: selectedUserId,
      productId: selectedProductId,
    };

    const response = await api.post("/License/CreateLicenseKey", newLicense);

    if (response.ok) {
      const data = await response.json();
      setLicenses([...licenses, data]);
      setSelectedUserId(null);
      setSelectedProductId(null);
      handleClose();
    } else {
      alert("Failed to create license.");
    }
  };

  return (
    <>
      <Typography variant="h6" noWrap component="div">
        All Licenses
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3, mb: 2, float: "right" }}
        onClick={handleOpen}
      >
        Add License +
      </Button>
      {licenses !== null && licenses.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Key</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Is Activated</TableCell>
                <TableCell>Created Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Map over licenses data to render table rows */}
              {licenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell>{license.id}</TableCell>
                  <TableCell>{license.key}</TableCell>
                  <TableCell>{license.productName}</TableCell>
                  <TableCell>{license.userName}</TableCell>
                  <TableCell>{license.isActivated ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {new Date(license.createdDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No licenses found.</p>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Create New License
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="user-select-label">User</InputLabel>
            <Select
              labelId="user-select-label"
              id="user-select"
              value={selectedUserId}
              label="User"
              onChange={handleUserChange}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.userName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="product-select-label">Product</InputLabel>
            <Select
              labelId="product-select-label"
              id="product-select"
              value={selectedProductId}
              label="Product"
              onChange={handleProductChange}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
            sx={{ mt: 2, float: "right" }}
          >
            Create License
          </Button>
        </Box>
      </Modal>
    </>
  );
}
