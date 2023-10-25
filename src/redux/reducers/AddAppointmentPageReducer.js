const initialState = {
  error: null,
  loading: false,
  data: [], 
};

const AppointmentPageReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case "APPOINTMENT_REQUEST":
      return { ...state, loading: true };
    case "APPOINTMENT_RESPONSE":
      return {
        ...state,
        loading: false,
        data: payload,
      };
    case "APPOINTMENT_ERROR":
      return { loading: false, error: payload };
 
    default:
      return state;
  }
};

export default AppointmentPageReducer;
