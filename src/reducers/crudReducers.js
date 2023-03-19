const initialState = {};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_DATA":
      const addCollection = state[action.payload.collectionName] || [];
      return {
        ...state,
        [action.payload.collectionName]: [...addCollection, action.payload.data]
      };
    case "DELETE_DATA":
      const deleteCollection = state[action.payload.collectionName] || [];
      return {
        ...state,
        [action.payload.collectionName]: deleteCollection.filter(
          (item) => item.id !== action.payload.id
        )
      };
    case "UPDATE_DATA":
      const updateCollection = state[action.payload.collectionName] || [];
      return {
        ...state,
        [action.payload.collectionName]: updateCollection.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.data }
            : item
        )
      };
    case "LOAD_DATA":
      return {
        ...state,
        [action.payload.collectionName]: action.payload.data
      };
    default:
      return state;
  }
};

export default dataReducer;