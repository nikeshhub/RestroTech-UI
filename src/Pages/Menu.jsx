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
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTable: initialSelectedTable, guestCount: initialGuestCount } =
    location.state || {
      selectedTable: null,
      guestCount: 1,
    };
  const [selectedTable, setSelectedTable] = useState(initialSelectedTable);
  const [guestCount, setGuestCount] = useState(initialGuestCount);

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
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
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
  console.log(itemsToOrder);

  useEffect(() => {
    fetchMenuData();
  }, []);
  console.log("menu", menuItems);
  console.log(selectedTable);

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

  const handleClickOpen = (item) => {
    if (item && item.nativeEvent) {
      item = null;
    }
    console.log("Item", item);
    if (item) {
      setIsEditing(true);
      setEditingItem(item);
      setNewMenuItem(item);
    } else {
      setIsEditing(false);
      setNewMenuItem({
        name: "",
        price: "",
        category: "",
        description: "",
        estimatedTime: "",
        photo: null,
      });
    }
    setOpen(true);
  };

  console.log("editingItem", editingItem);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newMenuItem.name);
    formData.append("price", newMenuItem.price);
    formData.append("category", newMenuItem.category);
    formData.append("description", newMenuItem.description);
    formData.append("estimatedTime", newMenuItem.estimatedTime);
    if (newMenuItem.photo) {
      formData.append("file", newMenuItem.photo);
    }

    try {
      await axiosInstance.put(
        `http://localhost:8000/menu/${editingItem._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      handleClose();
      fetchMenuData();
      console.log("Menu item updated successfully!");
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const handleAddMenuItem = async (e) => {
    if (isEditing) {
      handleEdit(e);
      return;
    }
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

  const subtotal = itemsToOrder.reduce(
    (acc, item) => acc + item.price * (quantities[item.id] || 1),
    0
  );
  const serviceCharge = subtotal * 0.1;
  const total = subtotal + serviceCharge;

  const handleCancelOrder = () => {
    setItemsToOrder([]);
    setQuantities({});
  };

  const handleSendOrder = async () => {
    try {
      await axiosInstance.post("http://localhost:8000/order", {
        tableNumber: selectedTable,
        items: itemsToOrder.map((item) => ({
          menuItem: item._id,
          quantity: quantities[item._id] || 1,
        })),
      });
      handleCancelOrder();
      toast.success("Order placed successfully");
      setSelectedTable(null);
      setGuestCount(1);
      // alert("Order sent successfully!");
    } catch (error) {
      console.error("Error sending order:", error);
      toast.error("Error sending order");
    }
  };
  console.log("Items to order", itemsToOrder);
  console.log("Quantities", quantities);

  return (
    <Grid container spacing={4}>
      <Toaster position="top-right" reverseOrder={false} />
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
                      <IconButton
                        color="primary"
                        onClick={() => handleClickOpen(item)}
                      >
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
          {selectedTable ? (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  ORDER
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <AccessibilityIcon sx={{ mr: 1 }} />
                  <Typography>GUESTS: {guestCount}</Typography>
                  <AttachFileIcon sx={{ ml: 4, mr: 1 }} />
                  <Typography>TABLE: {selectedTable}</Typography>
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
                  <Typography>{subtotal}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography>SERVICE CHARGE 10%</Typography>
                  <Typography>{serviceCharge}</Typography>
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
                  <Typography>{total}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancelOrder}
                  disabled={itemsToOrder.length < 1}
                >
                  CANCEL ORDER
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSendOrder}
                  disabled={itemsToOrder.length < 1}
                >
                  SEND ORDER
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography>Please select tables to order</Typography>
              <Button
                onClick={() => {
                  navigate("/tables");
                }}
              >
                Go to Table Selection
              </Button>
            </>
          )}
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
        <DialogTitle>
          {" "}
          {isEditing ? "Edit Menu Item" : "Add New Menu Item"}{" "}
        </DialogTitle>
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
            {!isEditing && (
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
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddMenuItem} color="primary">
            {isEditing ? "Edit" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Menu;
