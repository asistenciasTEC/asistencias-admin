export const addData = (collectionName, data) => ({
    type: "ADD_DATA",
    payload: {
      collectionName: collectionName,
      data: data
    }
  });
  
  export const deleteData = (collectionName, id) => ({
    type: "DELETE_DATA",
    payload: {
      collectionName: collectionName,
      id: id
    }
  });
  
  export const updateData = (collectionName, id, data) => ({
    type: "UPDATE_DATA",
    payload: {
      collectionName: collectionName,
      id: id,
      data: data
    }
  });
  
  export const loadData = (collectionName, data) => ({
    type: "LOAD_DATA",
    payload: {
      collectionName: collectionName,
      data: data
    }
  });