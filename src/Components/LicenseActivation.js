import { useState, useEffect } from "react";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import api from "../Services/api";

export default function LicenseActivation() {
  const [licenses, setLicenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [selectedLicenseKey, setSelectedLicenseKey] = useState("");
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem("id")) | 0
  );

  useEffect(() => {
    const fetchLicenses = async () => {
      const res = await api.get(`/License/GetUserLicensesById?id=${userId}`);
      if (res.data.success) {
        setLicenses(res.data.result);
      }
    };

    fetchLicenses();
  }, [userId]);

  const handleOpen = (licenseId) => {
    setSelectedLicense(licenseId);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedLicense(null);
    setSelectedLicenseKey("");
    setOpen(false);
  };

  const handleChangeLicenseKey = (event) => {
    setSelectedLicenseKey(event.target.value);
  };

  const handleActivateLicense = async () => {
    if (!selectedLicenseKey) {
      alert("Please enter an license key.");
      return;
    }

    const response = await fetch(`/api/licenses/${selectedLicense}/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ LicenseKey: selectedLicenseKey }),
    });

    if (response.ok) {
      const updatedLicenses = licenses.map((license) => {
        if (license.id === selectedLicense) {
          return { ...license, isActive: true };
        }
        return license;
      });
      setLicenses(updatedLicenses);
      handleClose();
    } else {
      alert("Failed to activate license.");
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
        Activate License
      </Button>
      {licenses.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {licenses.map((license) => (
                  <TableRow key={license.id}>
                    <TableCell>{license.id}</TableCell>
                    <TableCell>{license.productName}</TableCell>
                    <TableCell>
                      {new Date(license.createdDate).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </TableCell>
                    <TableCell>
                      {license.isActivated ? "Activated" : "Inactive"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <p>No active licenses found.</p>
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
            License Key
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="LicenseKey"
            label="License Key"
            name="LicenseKey"
            value={selectedLicenseKey}
            onChange={handleChangeLicenseKey}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleActivateLicense}
            sx={{ mt: 2, float: "right" }}
          >
            Activate
          </Button>
        </Box>
      </Modal>
    </>
  );
}
