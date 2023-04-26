import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

const DashboardCard = ({ value, name, image }: any) => {
  return (
    <div className="card-container">
      <Card className="dashbodar-card">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "60%",
            height: "100%",
            justifyContent: "center"
          }}
        >
          <CardContent>
            <Typography variant="h5"> {value} </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {name}
            </Typography>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          image={image}
          sx={{ width: "40%", objectFit: "fill" }}
        ></CardMedia>
      </Card>
    </div>
  );
};

export default DashboardCard;
