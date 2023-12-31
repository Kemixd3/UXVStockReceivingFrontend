import { useState, useEffect } from "react";
import "./NewBatch.css";
import { submitReceivedGoods } from "../Controller/RecievedGoodsController";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function BatchDialog({
  selectedItem,
  handleCloseDialog,
  recieved_goods,
  userData,
  items,
  selectedBatch,
}) {
  const [recievedGoodsData, setRecievedGoods] = useState([]);
  const [formData, setFormData] = useState({});
  const [formQuantityLimit, setQuantity] = useState(selectedItem.Quantity);
  const [warning, setWarning] = useState();

  useEffect(() => {
    //populate form
    if (selectedItem) {
      setFormData(selectedItem);
    }
    if (recieved_goods) {
      setRecievedGoods(recieved_goods[0]);
    }
  }, [selectedItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;

    const aboveLimitItems = items.filter(
      (item) => item.Quantity > formQuantityLimit
    );

    if (!(aboveLimitItems.length > 0)) {
      response = await submitReceivedGoods(
        items,
        selectedBatch,
        userData,
        formData,
        recievedGoodsData
      );

      if (
        response &&
        response.error &&
        response.error.response &&
        response.error.response.data &&
        response.error.response.data.error &&
        response.error.response.data.error.length > 0
      ) {
        setWarning(response.error.response.data.error);
      } else {
        handleCloseDialog();
      }
    } else {
      setWarning(
        "Only " + formQuantityLimit + " has been ordered and can be received"
      );
    }
  };

  const validateQuantityChange = (e) => {
    if (e.target.value == "") {
      e.target.value = 0;
    }
    const inputQuantity = parseInt(e.target.value);

    const maxQuantity = formQuantityLimit; //set Quantity to the max limit of PO
    if (!isNaN(inputQuantity) && inputQuantity <= maxQuantity) {
      setFormData({ ...formData, Quantity: inputQuantity });
    } else {
      alert("MAX Quantity in the PO is " + maxQuantity);
    }
  };

  return (
    <div className="backdrop">
      <dialog className="dialog" open>
        {warning && (
          <Alert variant="filled" severity="warning" color="info">
            {warning}
          </Alert>
        )}

        {items && items.length > 0 ? (
          <div>
            <h4>Adding materials to batch</h4>
            {items.map((element, index) => (
              <div key={index}>
                <p>Item {index + 1}</p>
                <p>SI Number: {element.SI_number}</p>
                <p>Barcode: {element.Name}</p>
                <p>Quantity: {element.Quantity}</p>

                <hr />
              </div>
            ))}
            <button type="submit" className="me-5" onClick={handleSubmit}>
              Save
            </button>
            <button type="button" onClick={handleCloseDialog}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h4>
              Creating a batch for Material {formData.item_type}{" "}
              {formData.SI_number}
            </h4>
            <label htmlFor="Batch Name">Batch Name</label>
            <div>
              {" "}
              <input
                label="Batch Name"
                type="text"
                value={formData.Name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, Name: e.target.value })
                }
              />
            </div>
            <label htmlFor="Quantity of batch">Quantity of batch</label>
            <div>
              {" "}
              <input
                label="Quantity of batch"
                type="text"
                value={formData.Quantity || ""}
                onChange={(e) => validateQuantityChange(e)}
              />
            </div>

            <button className="me-5" type="submit">
              Save
            </button>
            <button type="button" onClick={handleCloseDialog}>
              Close
            </button>
          </form>
        )}
      </dialog>
    </div>
  );
}
