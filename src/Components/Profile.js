import { Typography, Grid, TextField } from "@mui/material";

export default function Profile() {
  var user = JSON.parse(localStorage.getItem("userData"));
  return (
    <div>
      <Typography variant="h4">Profile</Typography>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <TextField
            label="Email"
            variant="outlined"
            value={user.email}
            sx={{ width: "50%" }}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Username"
            variant="outlined"
            value={user.userName}
            disabled
            sx={{ width: "50%" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="First Name"
            variant="outlined"
            value={user.firstName}
            sx={{ width: "50%" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Last Name"
            variant="outlined"
            sx={{ width: "50%" }}
            value={user.lastName}
          />
        </Grid>
      </Grid>
    </div>
  );
}
