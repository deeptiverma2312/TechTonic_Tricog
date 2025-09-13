import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const patientApi = createApi({
  reducerPath: "patientAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_URL}/patients`,
  }),
  endpoints: (builder) => ({
    // REMOVED: login and register mutations (no auth needed)
    
    // Query endpoints - now work without patient ID requirement
    fetchHealthHistory: builder.query({
      query: () => ({
        url: "/health_history",
        method: "GET",
      }),
    }),
    fetchPrescription: builder.query({
      query: () => ({
        url: "/prescription",
        method: "GET",
      }),
    }),
    fetchTests: builder.query({
      query: () => ({
        url: "/tests",
        method: "GET",
      }),
    }),
    fetchVisits: builder.query({
      query: () => ({
        url: "/visits",
        method: "GET",
      }),
    }),
    
    // Form submission endpoints - work with hardcoded patient data
    healthForm: builder.mutation({
      query: (formData) => ({
        url: "/health_history",
        method: "POST",
        body: formData,
      }),
    }),
    testForm: builder.mutation({
      query: (formData) => ({
        url: "/tests",
        method: "POST",
        body: formData,
      }),
    }),
    prescriptionForm: builder.mutation({
      query: (formData) => ({
        url: "/prescription",
        method: "POST",
        body: formData,
      }),
    }),
    
    // NEW: Chat data collection endpoint for hackathon
    collectPatientData: builder.mutation({
      query: (patientData) => ({
        url: "/collect-patient-data",
        method: "POST",
        body: patientData,
      }),
    }),
    
    // REMOVED: requestDoctor mutation (no doctor management needed)
  }),
});

export const {
  // REMOVED: useLoginMutation, useRegisterMutation
  useFetchHealthHistoryQuery,
  useFetchPrescriptionQuery,
  useFetchTestsQuery,
  useHealthFormMutation,
  usePrescriptionFormMutation,
  useTestFormMutation,
  useFetchVisitsQuery,
  useCollectPatientDataMutation, // NEW: For chat assistant
  // REMOVED: useRequestDoctorMutation
} = patientApi;
export { patientApi };