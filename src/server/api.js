import { makeRequest } from "./instance";

export const addTravelAgency = (body) => {
  return makeRequest("post", "agency", body);
};

export const getTravelAgency = (pageNumber) => {
  return makeRequest("get", `agency?page=${pageNumber}`);
};

export const searchTravelAgency = ({ emailId, CNIC, agencyName, status }) => {
  const queryParams = new URLSearchParams();

  if (emailId) queryParams.append("agencyEmail", emailId);
  if (CNIC) queryParams.append("CNIC", CNIC);
  if (agencyName) queryParams.append("agencyName", agencyName);
  if (status) queryParams.append("status", status);

  return makeRequest("get", `agency?${queryParams.toString()}`);
};

export const searchAgencySatffAdmin = ({ email, CNIC, firstName, status }) => {
  const queryParams = new URLSearchParams();

  if (email) queryParams.append("email", email);
  if (CNIC) queryParams.append("CNIC", CNIC);
  if (firstName) queryParams.append("firstName", firstName);
  if (status) queryParams.append("status", status);

  return makeRequest("get", `staff/getAllAdmin?${queryParams.toString()}`);
};

export const searchAgencySatff = ({ email, CNIC, firstName }, id) => {
  const queryParams = new URLSearchParams();
  if (email) queryParams.append("email", email);
  if (CNIC) queryParams.append("CNIC", CNIC);
  if (firstName) queryParams.append("firstName", firstName);

  return makeRequest("get", `staff/getAll/${id}?${queryParams.toString()}`);
};

export const searchCityCode = (keyword) => {
  // return makeRequest("get", `flights/cityData?city=${keyword}`);
  return makeRequest("get", `sabre/sabreCityData?city=${keyword}`);
};

export const getAgencyUsers = (id, pageNumber) => {
  return makeRequest("get", `staff/getAll/${id}?page=${pageNumber}`);
};
export const getAgencyAllUsers = (pageNumber) => {
  return makeRequest("get", `staff/getAllAdmin?page=${pageNumber}`);
};

export const addAgencyUser = (body) => {
  return makeRequest("post", "staff/create", body);
};

export const deleteAgencyUser = (id) => {
  return makeRequest("delete", `users/${id}`);
};

export const deleteStaffUser = (id) => {
  return makeRequest("delete", `staff/delete/${id}`);
};

export const getAgencyUserRoles = () => {
  return makeRequest("get", `roles/roleAgency`);
};

export const getAgencyTypes = () => {
  return makeRequest("get", `type/getAll`);
};

export const updateAgencyUserStatus = (id, body) => {
  return makeRequest("put", `staff/status/${id}`, body);
};

export const userLogin = (body) => {
  return makeRequest("post", "auth/login", body);
};

export const userRegister = (body) => {
  return makeRequest("post", "auth/register", body);
};

export const getFlightBooking = (body) => {
  return makeRequest("post", "agency", body);
};

export const getAnalyticsData = () => {
  return makeRequest("get", "agency/EmployeeData");
};

export const getFlightsData = ({
  startDate,
  endDate,
  arrival,
  departure,
  adultsCount,
  childrenCount,
  infantsCount,
  currencyPreference,
  airLinePreference,
  excludedAirlines,
  ticketClass,
  ticketCount,
  flightPriceRange,
  flightStops,
  staffMarkupValue,
  staffMarkupType,
  travelClass,
  returnTravelClass
}) => {
  // Base URL with mandatory parameters
  let url = `flights/flightData?start_date=${startDate}&arrival=${arrival}&dept=${departure}`;

  // Conditionally append optional parameters if they exist
  if (endDate) {
    url += `&end_date=${endDate}`;
  }
  if (adultsCount) {
    url += `&adult=${adultsCount}`;
  }
  if (childrenCount) {
    url += `&children=${childrenCount}`;
  }
  if (infantsCount) {
    url += `&infants=${infantsCount}`;
  }
  if (currencyPreference) {
    url += `&currencyCode=${currencyPreference}`;
  }
  if (ticketClass) {
    url += `&travelClass=${ticketClass}`;
  }
  if (flightStops !== undefined) {
    url += `&nonStop=${flightStops}`;
  }
  if (flightPriceRange) {
    url += `&maxPrice=${flightPriceRange}`;
  }
  if (ticketCount) {
    url += `&max=${ticketCount}`;
  }
  if (airLinePreference) {
    url += `&includedAirlineCodes=${airLinePreference}`;
  }
  if (excludedAirlines) {
    url += `&excludedAirlineCodes=${excludedAirlines}`;
  }

  if (staffMarkupValue) {
    url += `&staffMarkupValue=${staffMarkupValue}`;
  }

  if (staffMarkupType) {
    url += `&staffMarkupType=${staffMarkupType}`;
  }

  if (travelClass) {
    url += `&travelClass=${travelClass}`;
  }

  if (returnTravelClass) {
    url += `&returnTravelClass=${returnTravelClass}`;
  }

  console.log(
    "url is .......",
    startDate,
    endDate,
    arrival,
    departure,
    adultsCount,
    childrenCount,
    infantsCount,
    currencyPreference,
    airLinePreference,
    excludedAirlines,
    ticketClass,
    ticketCount,
    flightPriceRange,
    flightStops
  );
  // Make the request with the constructed URL
  return makeRequest("get", url);
};

export const submitBookingRequest = (body) => {
  return makeRequest("post", "flights/createBooking", body);
};

export const submitSabreBookingRequest = (body) => {
  return makeRequest("post", "sabre/createBooking", body);
};

export const submitSabreBookingMRequest = (body) => {
  return makeRequest("post", "sabre/createBookingM", body);
};

export const verifyOtp = (body) => {
  return makeRequest("post", "auth/verifyOTP", body);
};

export const resendOtp = (body) => {
  return makeRequest("post", "auth/resendOTP", body);
};

export const ForgetPasswordEmailSend = (body) => {
  return makeRequest("post", "auth/forgotPassword", body);
};

export const ResetPassword = (token, body) => {
  return makeRequest("post", `auth/resetPassword/${token}`, body);
};

export const getSabreFlightsData = ({
  startDate,
  endDate,
  arrival,
  departure,
  adultsCount,
  childrenCount,
  infantsCount,
  currencyPreference,
  airLinePreference,
  excludedAirlines,
  ticketClass,
  ticketCount,
  flightPriceRange,
  flightStops,
  staffMarkupValue,
  staffMarkupType,
  travelClass,
  returnTravelClass,
  tripType
}) => {
  // Base URL with mandatory parameters
  let url = `sabre/flightData?start_date=${startDate}&arrival=${arrival}&dept=${departure}`;

  // Conditionally append optional parameters if they exist
  if (endDate) {
    url += `&end_date=${endDate}`;
  }
  if (adultsCount) {
    url += `&adult=${adultsCount}`;
  }
  if (childrenCount) {
    url += `&children=${childrenCount}`;
  }
  if (infantsCount) {
    url += `&infants=${infantsCount}`;
  }
  if (currencyPreference) {
    url += `&currencyCode=${currencyPreference}`;
  }
  if (ticketClass) {
    url += `&travelClass=${ticketClass}`;
  }
  if (flightStops !== undefined) {
    url += `&nonStop=${flightStops}`;
  }
  if (flightPriceRange) {
    url += `&maxPrice=${flightPriceRange}`;
  }
  if (ticketCount) {
    url += `&max=${ticketCount}`;
  }
  if (airLinePreference) {
    url += `&includedAirlineCodes=${airLinePreference}`;
  }
  if (excludedAirlines) {
    url += `&excludedAirlineCodes=${excludedAirlines}`;
  }
  if (staffMarkupValue) {
    url += `&staffMarkupValue=${staffMarkupValue}`;
  }

  if (staffMarkupType) {
    url += `&staffMarkupType=${staffMarkupType}`;
  }

  if (travelClass) {
    url += `&travelClass=${travelClass}`;
  }

  if (returnTravelClass) {
    url += `&returnTravelClass=${returnTravelClass}`
  }

  if (tripType) {
    url += `&tripType=${tripType}`
  }


  console.log(
    "url is .......",
    startDate,
    endDate,
    arrival,
    departure,
    adultsCount,
    childrenCount,
    infantsCount,
    currencyPreference,
    airLinePreference,
    excludedAirlines,
    ticketClass,
    ticketCount,
    flightPriceRange,
    flightStops
  );
  // Make the request with the constructed URL
  return makeRequest("get", url);
};

export const getSabreFlightsDataMultiCity = (body) => {
  return makeRequest("post", "sabre/flightData/multipleCity", body);
};

export const getAgencySalesData = () => {
  return makeRequest("get", "flights/agencySaleData");
};

export const getFlightSalesData = () => {
  return makeRequest("get", "flights/getFlightSalesData");
};

export const getDashboardData = () => {
  return makeRequest("get", "flights/data");
};

export const getSalesData = () => {
  return makeRequest("get", "flights/sale?filter=yearly");
};

export const getAllBookings = () => {
  return makeRequest("get", "booking/getAll");
};

export const getFlightRules = (body) => {
  return makeRequest("post", "flights/flightRules", body);
};

export const getSabreFareRules = (body) => {
  return makeRequest("post", "sabre/fareRules", body);
};

export const updateAgencyStaff = (id, body) => {
  return makeRequest("patch", `staff/update/${id}`, body);
};

export const salesGraph = (params) => {
  return makeRequest("get", `flights/filterSale?filter=${params}`);
};

export const getAgencyById = (id) => {
  return makeRequest("get", `agency/${id}`);
};

export const voidFlight = (id, url) => {
  return makeRequest("post", `${url}/voidFlightTickets`, { pnr: id });
};

export const refundFlight = (bookingId, url) => {
  return makeRequest("post", `${url}/refundFlightTickets`, { bookingId });
};

export const cancelBooking = (id, url) => {
  return makeRequest("put", `${url}/cancelBooking`, { pnr: id });
};

export const issueTicket = (body, url) => {
  return makeRequest("post", `${url}/issueTicket`, body);
};

export const issueTicketOffline = (body, url) => {
  return makeRequest("post", `${url}/issueTicketOffline`, body);
};

export const multiCityAmedus = (body) => {
  return makeRequest("post", "flights/multiFlightData", body);
};

export const brandedFareAmedus = (body) => {
  return makeRequest("post", "flights/upselling", body);
};

export const revalidateSabre = (body) => {
  return makeRequest("post", `sabre/revalidate`, body);
};

export const revalidateAmadus = (body) => {
  return makeRequest("post", `flights/revalidate`, body);
};

export const comparePNR = (id, url) => {
  return makeRequest("post", `${url}/comparePNR`, { pnr: id });
};

export const updateStatus = (id, url, status, ticket) => {
  return makeRequest("post", `${url}/updateStatus`, {
    pnr: id,
    status,
    ticket,
  });
};

export const viewItinary = (id, url) => {
  return makeRequest("post", `${url}/viewItinary`, { pnr: id });
};

// New API function for getting booking with logos
export const viewItinaryWithLogos = (pnr) => {
  return makeRequest("get", `sabre/get-booking-with-logos?pnr=${pnr}`);
};

export const importPnr = (id, url) => {
  return makeRequest("post", `${url}/importPNR`, { pnr: id });
};

export const modifyPnr = (url, body) => {
  return makeRequest("post", `${url}/modifyPNR`, body);
};

export const getUsersSales = () => {
  return makeRequest("get", `/staff/getUsersSales`);
};

export const getSaleGraph = (value) => {
  return makeRequest("get", `/staff/getSaleGraph?filter=${value}`);
};

export const getAgentBooking = () => {
  return makeRequest("get", `/staff/getBooking`);
};
export const getAllBook = () => {
  return makeRequest("get", `book/getAll`);
};
export const agentLedger = (id) => {
  return makeRequest("get", `booking/getByRole/${id}`);
};

export const getAllSPOStaff = (id) => {
  return makeRequest("get", `/staff/getAllSPOStaff/${id}`);
};

export const getUpselling = (body) => {
  return makeRequest("post", `/flights/upselling`, body);
};

export const getAllLedger = () => {
  return makeRequest("get", `/customerLedger/getAllLedger`);
};

export const bookAndIssue = (apiName, body) => {
  return makeRequest("post", `/${apiName}/book&Issue`, body);
};

export const sabreMultiCitybookAndIssue = (body) => {
  return makeRequest("post", `/sabre/Mbook&Issue`, body);
};

export const addSearch = (body) => {
  return makeRequest("post", `/customerLedger/addsearch`, body);
};

export const getRecentSearch = () => {
  return makeRequest("get", `/customerLedger/getsearch`);
};

export const addCreateMarkup = (body) => {
  return makeRequest("post", `/markup/create`, body);
};

export const getAllMarkup = () => {
  return makeRequest("get", `/markup/getAll`);
};

export const editMarkup = (id, body) => {
  return makeRequest("patch", `/markup/update/${id}`, body);
};

export const getAllAirlines = () => {
  return makeRequest("get", `/markup/gettAllAirlines`);
};
export const getCustomerAccountStatementSearch = (startDate, endDate, selectedSPO) => {
  return makeRequest("get", `/booking/customerAccountstatement?startDate=${startDate}&endDate=${endDate}${selectedSPO !== 'all' ? `&spoId=${selectedSPO}` : ''}`);
};
export const getSupplierAccountStatementSearch = (startDate, endDate, selectedSPO) => {
  return makeRequest("get", `/booking/supplierAccountstatement?startDate=${startDate}&endDate=${endDate}${selectedSPO !== 'all' ? `&spoId=${selectedSPO}` : ''}`);
};
export const getSupplierLedgerSearch = (startDate, endDate, selectedSPO) => {
  return makeRequest("get", `/Ledger/supplierLedger?startDate=${startDate}&endDate=${endDate}${selectedSPO !== 'all' ? `&spoId=${selectedSPO}` : ''}`);
};
export const getCustomerLedgerSearch = (startDate, endDate, selectedSPO) => {
  return makeRequest("get", `/Ledger/customerLedger?startDate=${startDate}&endDate=${endDate}${selectedSPO !== 'all' ? `&spoId=${selectedSPO}` : ''}`);
};

export const getAllSPO = () => {
  return makeRequest("get", `/users/getAllSPOs`);
};

export const createLedger = (body) => {
  return makeRequest("post", '/Ledger/create', body)
}
export const AddSupplierLedger = (body) => {
  return makeRequest("post", '/Ledger/supplierLedger', body)
}

export const updateLedger = (body) => {
  return makeRequest("patch", '/Ledger/update', body)
}

export const addPSF = (body) => {
  return makeRequest("post", '/booking/addPSF', body)
}

export const updateBalance = (body) => {
  return makeRequest("post", '/staff/update-balance', body)
}

export const getStaffDetailById = (id) => {
  return makeRequest("get", `/staff/getSingle/${id}`)
}

export const getTicketsByMonth = (month, year) => {
  return makeRequest(
    "get",
    `sabre/getTicketsByMonth?month=${month}&year=${year}`
  );
};

export const deleteRecentSearch = (id) => {
  return makeRequest("delete", `/customerLedger/deleteRecentSearch/${id}`);
};

export const getUserDetails = (body) => {
  return makeRequest("post", `/customer/getUserDetails`, body);
}

export const getBalanceOfStaff = () => {
  return makeRequest("get", "staff/getBalanceOfStaff")
}

export const resetLimitOfStaff = (body) => {
  return makeRequest("post", "staff/resetLimit", body)
}

export const addlimitOfStaff = (body) => {
  return makeRequest("post", "staff/addlimit", body)
}

export const updateProfilePassword = (body) => {
  return makeRequest("patch", "auth/updatePassword", body)
}