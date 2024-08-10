import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import {
  Card,
  CardContent,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Button,
} from "@mui/material";
import axios from "axios";
import { axiosInstance } from "../Helpers/axiosInstance";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axiosInstance.get(
          "http://localhost:8000/order"
        );
        const menuItemsResponse = await axiosInstance.get(
          "http://localhost:8000/menu"
        );
        const tablesResponse = await axiosInstance.get(
          "http://localhost:8000/table"
        );

        setOrders(ordersResponse.data.data);
        setMenuItems(menuItemsResponse.data.data);
        setTables(tablesResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Compute totals and chart data

  const totalOrderValue = orders?.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );
  const totalMenuItems = menuItems?.length;
  const totalTables = tables?.length;

  // Prepare chart data
  const orderCountsByMonth = Array(12).fill(0);
  orders.forEach((order) => {
    const month = new Date(order.createdAt).getMonth();
    orderCountsByMonth[month] += 1;
  });

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Orders",
        data: orderCountsByMonth,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container className="mt-5">
      <Typography variant="h4" gutterBottom className="mb-4">
        Overview
      </Typography>

      <div className="flex space-x-4 mb-4">
        <Card className="flex-1">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Order Value
            </Typography>
            <Typography variant="h4">Rs. {totalOrderValue}</Typography>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Menu Items
            </Typography>
            <Typography variant="h4">{totalMenuItems}</Typography>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Tables
            </Typography>
            <Typography variant="h4">{totalTables}</Typography>
          </CardContent>
        </Card>
      </div>

      <Paper className="mb-4 p-4">
        <Typography variant="h6" gutterBottom>
          Order Trends
        </Typography>
        <Line data={chartData} />
      </Paper>

      <Paper className="mb-4 p-4">
        <Typography variant="h6" gutterBottom>
          Orders
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Table Number</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell>{order?.tableNumber?.number}</TableCell>
                  <TableCell>
                    {order.items.map((item) => item?.menuItem?.name).join(", ")}
                  </TableCell>
                  <TableCell>Rs. {order.totalPrice}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Home;
