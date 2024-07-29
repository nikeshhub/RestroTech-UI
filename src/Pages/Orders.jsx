import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { axiosInstance } from "../Helpers/axiosInstance";

const OrderCard = ({ order }) => (
  <Card variant="outlined">
    <CardContent>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h6">Order #{order._id}</Typography>
          <Typography color="textSecondary">
            Table Number: {order.tableNumber.number}
          </Typography>
        </Grid>
      </Grid>
      {order.items.map((item, index) => (
        <Box key={index} mt={2}>
          <Grid container>
            <Grid item xs={8}>
              <Typography>{item.menuItem.name}</Typography>
              <Typography color="textSecondary">
                Quantity: {item.quantity}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Total Price: {order.totalPrice}</Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          color={order.status === "completed" ? "success" : "error"}
          startIcon={
            order.status === "completed" ? <CheckCircleIcon /> : <CancelIcon />
          }
        >
          {order.status === "completed" ? "COMPLETED" : "PENDING"}
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:8000/order");

        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  console.log(orders);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Order List
      </Typography>
      <Grid container spacing={3}>
        {orders?.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order._id}>
            <OrderCard order={order} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders;
