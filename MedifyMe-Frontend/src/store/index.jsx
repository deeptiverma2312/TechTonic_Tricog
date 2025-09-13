import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { patientApi } from "./apis/patientsApi";
import { gptApi } from "./apis/gptApi";

// Simplified store - removed auth slices and doctor functionality
const store = configureStore({
  reducer: {
    [patientApi.reducerPath]: patientApi.reducer,
    [gptApi.reducerPath]: gptApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(patientApi.middleware)
      .concat(gptApi.middleware);
  },
});

setupListeners(store.dispatch);

export { store };

// Export only the APIs you need for hackathon
export {
  useFetchHealthHistoryQuery,
  useFetchPrescriptionQuery,
  useFetchTestsQuery,
  useHealthFormMutation,
  usePrescriptionFormMutation,
  useTestFormMutation,
  useFetchVisitsQuery,
} from "./apis/patientsApi";

export { useChatMutation } from "./apis/gptApi";

// REMOVED exports (no longer needed):
// - loginSuccess, logoutSuccess (auth actions)
// - doctorLoginSuccess, doctorLogoutSuccess (doctor auth)
// - useLoginMutation, useRegisterMutation (auth APIs)
// - useDLoginMutation, useFetchPatientsQuery, useAcceptPatientsMutation (doctor APIs)
// - useRequestDoctorMutation (doctor request API)