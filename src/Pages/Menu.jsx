import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { axiosInstance } from "../Helpers/axiosInstance";
import axios from "axios";
import { getAuthToken } from "../Helpers/getAuthToken";
import { CheckCircle, Delete, Edit } from "@mui/icons-material";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    estimatedTime: "",
    photo: null,
  });
  const [itemsToOrder, setItemsToOrder] = useState([]);
  const [quantities, setQuantities] = useState({});
  console.log("Quantity", quantities);
  console.log(itemsToOrder);

  const handleFileChange = (event) => {
    setNewMenuItem({
      ...newMenuItem,
      photo: event.target.files[0],
    });
  };
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMenuData = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:8000/menu");
      setMenuItems(response.data.data);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);
  console.log("menu", menuItems);

  // const menuItems = [
  //   {
  //     name: "AKBARE WINGS",
  //     category: "N",
  //     price: "RS 995",
  //     image: "./burger.jpeg",
  //   },
  //   {
  //     name: "CRISPY FRIES",
  //     category: "G",
  //     price: "RS 250",
  //     image: "./burger.jpeg",
  //   },
  //   {
  //     name: "VEG SALAD",
  //     category: "N",
  //     price: "RS 550",
  //     image: "./burger.jpeg",
  //   },
  //   {
  //     name: "GARLIC BREAD",
  //     category: "G",
  //     price: "RS 150",
  //     image: "./burger.jpeg",
  //   },
  //   {
  //     name: "BROWN BREAD",
  //     category: "G",
  //     price: "RS 120",
  //     image: "/placeholder.svg?height=200&width=200",
  //   },
  //   {
  //     name: "FISH KEBAB",
  //     category: "G",
  //     price: "RS 450",
  //     image: "/placeholder.svg?height=200&width=200",
  //   },
  //   {
  //     name: "CHICKEN BURGER",
  //     category: "G",
  //     price: "RS 320",
  //     image: "/placeholder.svg?height=200&width=200",
  //   },
  //   {
  //     name: "SUKUTI BREAD",
  //     category: "N",
  //     price: "RS 400",
  //     image: "/placeholder.svg?height=200&width=200",
  //   },
  // ];

  const handleAddToOrder = (item) => {
    console.log("item", item);
    // console.log("itemToOrder", ordered);

    // Add the item to the order
    setItemsToOrder([...itemsToOrder, item]);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item.id]: 1,
    }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newMenuItem.name);
    formData.append("price", newMenuItem.price);
    formData.append("category", newMenuItem.category);
    formData.append("description", newMenuItem.description);
    formData.append("estimatedTime", newMenuItem.estimatedTime);
    formData.append("file", newMenuItem.photo);

    console.log("final", formData);

    try {
      await axios.post("http://localhost:8000/menu", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      handleClose();
      fetchMenuData();
      console.log("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMenuItems = menuItems?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (item) => {
    console.log(item);
    console.log("delete");
    const response = await axiosInstance.delete(
      `http://localhost:8000/menu/${item?._id}`
    );
    console.log(response);
    fetchMenuData();
  };

  return (
    <Grid container spacing={4}>
      {/* Left side: Search and Menu items */}
      <Grid item xs={8}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <TextField
            sx={{ flexGrow: 1, mr: 2 }} // Add margin-right to create space between TextField and Button
            label="Search Menu"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{ boxShadow: 2 }}
          >
            Add Item
          </Button>
        </Box>
        <Grid container spacing={2}>
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item, index) => (
              <Grid key={index} item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2,
                    boxShadow: 1,
                    borderRadius: 1,
                    bgcolor: "background.paper",
                    height: "100%",
                    position: "relative",
                    "&:hover .edit-delete-icons": {
                      display: "flex",
                    },
                  }}
                >
                  <img
                    src={item.photo}
                    alt={item.name}
                    style={{
                      width: "100%",
                      borderRadius: "8px 8px 0 0",
                      objectFit: "cover",
                      maxHeight: 200,
                    }}
                  />
                  <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CATEGORY: <Badge variant="secondary">{item.category}</Badge>
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", mt: 1 }}
                  >
                    {item.price}
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {itemsToOrder.includes(item) ? (
                      <IconButton color="primary">
                        <CheckCircle />
                      </IconButton>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleAddToOrder(item)}
                      >
                        Add
                      </Button>
                    )}
                    <Box
                      className="edit-delete-icons"
                      sx={{ ml: 1, display: "none" }}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => handleDelete(item)}
                      >
                        <Delete />
                      </IconButton>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))
          ) : (
            <>
              <Typography margin={5}>No menu items found</Typography>
            </>
          )}
        </Grid>
      </Grid>
      {/* Right side: Order details */}
      <Grid item xs={4}>
        <Box
          sx={{
            position: "fixed",
            p: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
            maxHeight: "calc(100vh - 10px)",
            overflowY: "auto",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              ORDER #6
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <AccessibilityIcon sx={{ mr: 1 }} />
              <Typography>GUESTS: 2</Typography>
              <AttachFileIcon sx={{ ml: 4, mr: 1 }} />
              <Typography>TABLE: 3</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 4 }}>
            {itemsToOrder?.map((item) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 2,
                  borderBottom: "1px solid #ccc",
                }}
              >
                <Typography>{item.name}</Typography>
                <Box>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={quantities[item.id] || 1}
                    onChange={(e) =>
                      setQuantities((prevQuantities) => ({
                        ...prevQuantities,
                        [item.id]: parseInt(e.target.value) || 1,
                      }))
                    }
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: 10,
                        // height: 4,
                        width: 70,
                        padding: 1,
                      },
                    }}
                    InputProps={{
                      inputProps: {
                        min: 1,
                      },
                    }}
                    size="small"
                    variant="outlined"
                  />
                  <Typography className="ml-4">
                    {item.price * (quantities[item.id] || 1)}
                  </Typography>
                </Box>
              </Box>
            ))}
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 2,
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography>AKBARE WINGS</Typography>
              <Box>
                <Typography>QUANTITY 2</Typography>
                <Typography className="ml-4">RS 995</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 2,
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography>CAESAR SALAD</Typography>
              <Box>
                <Typography>QUANTITY 1</Typography>
                <Typography className="ml-4">RS 550</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 2,
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography>CRISPY FRIES</Typography>
              <Box>
                <Typography>QUANTITY 1</Typography>
                <Typography className="ml-4">RS 250</Typography>
              </Box>
            </Box> */}
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>SUBTOTAL</Typography>
              <Typography>RS 2,790</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography>SERVICE CHARGE 10%</Typography>
              <Typography>RS 279</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                fontWeight: "bold",
              }}
            >
              <Typography>TOTAL</Typography>
              <Typography>RS 3,069</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="error">
              CANCEL ORDER
            </Button>
            <Button variant="contained" color="secondary">
              SEND ORDER
            </Button>
          </Box>
        </Box>
      </Grid>
      {/* Bottom fixed: Category buttons */}
      <Grid item xs={12}>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            p: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            <Button
              variant="contained"
              sx={{ bgcolor: "#FFA500", "&:hover": { bgcolor: "#FFA500" } }}
            >
              STARTER
            </Button>
            <Button variant="contained">MAIN COURSE</Button>
            <Button variant="contained">DRINKS</Button>
            <Button variant="contained">DESSERTS</Button>
          </Grid>
        </Box>
      </Grid>

      {/* Dialog for adding new menu item */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                value={newMenuItem.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="price"
                label="Price"
                type="text"
                fullWidth
                value={newMenuItem.price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="estimatedTime"
                label="Estimated Time"
                type="number"
                fullWidth
                value={newMenuItem.estimatedTime}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                multiline
                rows={4}
                fullWidth
                value={newMenuItem.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  name="category"
                  label="Category"
                  value={newMenuItem.category}
                  onChange={handleChange}
                >
                  <MenuItem value={"starters"}>Starters</MenuItem>
                  <MenuItem value={"main-course"}>Main Course</MenuItem>
                  <MenuItem value={"drinks"}>Drinks</MenuItem>
                  <MenuItem value={"desert"}>Desert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload File
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddMenuItem} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Menu;
