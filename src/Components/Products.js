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
} from "@mui/material";
import api from "../Services/api";

export default function Products() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");

  const [products, setProducts] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "version":
        setVersion(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !version) {
      alert("Please enter a name and version for the product.");
      return;
    }

    const newProduct = { name, version, description };

    const res = await api.post("/Products/CreateProduct", newProduct);
    if (res.data.success) {
      setProducts([...products, newProduct]);

      setName("");
      setVersion("");
      setDescription("");

      handleClose();
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/Products/GetAllProducts");
      if (res.data.success) {
        setProducts(res.data.result);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Typography variant="h6" noWrap component="div">
        All Products
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3, mb: 2, float: "right" }}
        onClick={handleOpen}
      >
        Add Product +
      </Button>

      {products !== null && products.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id || product.name}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.version}</TableCell>
                  <TableCell>
                    {product.description || "No Description"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="p"> No products found.</Typography>
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
          <Typography variant="h5" id="modal-title" component="h2">
            Add New Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              required
              label="Name"
              name="name"
              value={name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              autoFocus
            />
            <TextField
              required
              label="Version"
              name="version"
              value={version}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, float: "right" }}
            >
              Create Product
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
}
