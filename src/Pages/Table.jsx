import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Tooltip,
} from "@mui/material";
import { axiosInstance } from "../Helpers/axiosInstance";
import { getAuthToken } from "../Helpers/getAuthToken";
import toast, { Toaster } from "react-hot-toast";

const Table = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [open, setOpen] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:8000/table");
      setTables(response.data.data);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };
  useEffect(() => {
    fetchTables();
  }, []);

  const handleTableClick = (table) => {
    if (table.status !== "occupied") {
      setSelectedTable(table);
    }
  };

  const handleGuestCountChange = (change) => {
    setGuestCount((prevCount) => Math.max(1, prevCount + change));
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleCreateTable = async () => {
    try {
      const formData = {
        number: newTableName,
        capacity,
      };
      await axios.post("http://localhost:8000/table", formData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      handleCloseDialog();
      fetchTables();
      console.log("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSelectAndContinue = () => {
    if (guestCount > selectedTable.capacity) {
      toast.error("Guest count exceeds table capacity!");
    } else {
      navigate("/menu", {
        state: { selectedTable: selectedTable.number, guestCount },
      });
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TABLE LIST</h1>
        <div>
          <button
            onClick={handleOpenDialog}
            className="bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 rounded-md mr-4"
          >
            CREATE NEW TABLE
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-6">
        {tables.length === 0 ? (
          <div>No tables available. Add one.</div>
        ) : (
          tables.map((table) => (
            <Tooltip
              title={table?.status === "occupied" ? "Occupied" : ""}
              key={table.number}
            >
              <div
                onClick={() => handleTableClick(table)}
                className={`p-6 border-2 rounded-md cursor-pointer ${
                  selectedTable?.number === table.number
                    ? "border-purple-500"
                    : "border-gray-300"
                } ${
                  table.status === "occupied"
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute top-20 w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="absolute right-20 w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="absolute bottom-20 w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="absolute left-20 w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-16 p-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                      {table.number}
                    </div>
                  </div>

                  {selectedTable?.number === table.number && (
                    <div className="bg-blue-200 w-full mt-2 p-2 rounded-b-md flex justify-between items-center">
                      <button
                        onClick={() => handleGuestCountChange(-1)}
                        className="bg-gray-300 p-2 rounded-full"
                      >
                        -
                      </button>
                      <span className="px-4">{guestCount}</span>
                      <button
                        onClick={() => handleGuestCountChange(1)}
                        className="bg-gray-300 p-2 rounded-full"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Tooltip>
          ))
        )}
      </div>

      {tables.length > 0 && (
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">TABLE:</span>{" "}
            {selectedTable ? selectedTable.number : "-"}
            <span className="ml-4 font-semibold">GUEST:</span> {guestCount}
          </div>

          <button
            onClick={handleSelectAndContinue}
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            disabled={!selectedTable}
          >
            SELECT AND CONTINUE
          </button>
        </div>
      )}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Create New Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Table Name"
            type="text"
            fullWidth
            variant="standard"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Capacity"
            type="number"
            fullWidth
            variant="standard"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateTable}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Table;
