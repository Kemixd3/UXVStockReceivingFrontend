import axios from "axios";

const token = sessionStorage.getItem("token");
async function fetchReceivedGoods(id, userOrg) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_LOCALHOST
      }/receiving/received-goods/${id}/${userOrg}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching received goods:", error);
    return null;
  }
}

async function postReceivedGoods(id, userOrg) {
  try {
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const response = await axios.post(
      `${import.meta.env.VITE_LOCALHOST}/receiving/received-goods`,
      {
        received_date: currentDate,
        purchase_order_id: id,
        Organization: userOrg,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    if (response.status === 201) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error posting received goods:", error);
    throw new Error("Failed to post received goods");
  }
}

async function fetchReceivedGoodsItemsApi(batchId, siNumber) {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_LOCALHOST
      }/receiving/received_goods_items/${batchId}/${siNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.receivedGoodsItems;
  } catch (error) {
    console.error("Error fetching received goods items:", error.message);
    throw new Error("Failed to fetch received goods items");
  }
}

async function deleteReceivingItemApi(line) {
  try {
    const response = await axios.delete(
      `${
        import.meta.env.VITE_LOCALHOST
      }/receiving/received_goods_items/${line}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      console.log("Received goods item deleted successfully");
      return true;
    } else {
      throw new Error("Failed to delete received goods item");
    }
  } catch (error) {
    console.error("Error deleting received goods item:", error.message);
    throw new Error("Failed to delete received goods item");
  }
}

async function submitReceivedGoods(
  items,
  selectedBatch,
  userData,
  formData,
  recievedGoodsData
) {
  try {
    let response;
    if (items && items.length > 0) {
      const filteredItems = items.filter((item) => !item.received_item_id);
      const requestBody = {
        batch_id: selectedBatch.batch_id,
        receivedGoodsItems: filteredItems,
        purchase_order_id: recievedGoodsData.purchase_order_id,
      };

      response = await axios.post(
        import.meta.env.VITE_LOCALHOST + "/receiving/received_goods_items",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      const currentDate = new Date().toISOString().split("T")[0];
      const batchData = {
        received_date: currentDate,
        batch_name: formData.Name,
        si_number: formData.SI_number,
        createdBy: userData,
        received_goods_received_goods_id: recievedGoodsData.received_goods_id,
      };

      response = await axios.post(
        import.meta.env.VITE_LOCALHOST + "/batches",
        batchData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (response.status === 200 || response.status === 201) {
      const data = response.data;
      console.log("Success:", data);
      return data;
    } else {
      throw new Error("Failed to add received goods items");
    }
  } catch (error) {
    console.error("Error adding/retrieving data:", error.message);
    return { error: error };
  }
}

const updateReceivedGoodsItem = async (formData, purchase_order_id) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_LOCALHOST}/receiving/received_goods_items/${
        formData.received_item_id
      }`,
      {
        Name: formData.Name,
        Quantity: formData.Quantity,
        SI_number: formData.SI_number,
        createdBy: formData.createdBy,
        QuantityPO: formData.QuantityPO,
        received_goods_id: formData.received_goods_id,
        received_item_id: formData.received_item_id,
        purchase_order_id: purchase_order_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      console.log(data.message);
      return data;
    } else {
      console.error("Error updating received goods item:", response.data.error);
      throw new Error("Failed to update received goods item");
    }
  } catch (error) {
    console.error("Error updating received goods item:", error.message);
    throw error;
  }
};

export {
  fetchReceivedGoods,
  postReceivedGoods,
  fetchReceivedGoodsItemsApi,
  deleteReceivingItemApi,
  submitReceivedGoods,
  updateReceivedGoodsItem,
};
