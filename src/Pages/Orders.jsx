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
import { axiosInstance } from "../Helpers/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

const OrderCard = ({ order, completeOrder }) => (
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
          color={order.status === "closed" ? "success" : "error"}
          startIcon={
            order.status === "closed" ? <CheckCircleIcon /> : <CancelIcon />
          }
          disabled={order.status === "closed"}
          onClick={() => completeOrder(order._id)}
        >
          {order.status === "closed" ? "Closed" : "Complete Order"}
        </Button>
      </Box>
    </CardContent>
  </Card>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  console.log("Orders", orders);

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

  const completeOrder = async (orderId) => {
    try {
      await axiosInstance.put(`http://localhost:8000/order/close/${orderId}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "closed" } : order
        )
      );
      toast.success("Order closed");
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error("Error completing order");
    }
  };

  return (
    <Container>
      <Toaster position="top-right" reverseOrder={false} />

      <Typography variant="h4" gutterBottom>
        Order List
      </Typography>
      <Grid container spacing={3}>
        {orders?.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order._id}>
            <OrderCard order={order} completeOrder={completeOrder} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders;
