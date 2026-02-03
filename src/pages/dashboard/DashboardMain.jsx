import React from "react";
import { useSelector } from "react-redux";
import AddAgency from "../../pages-components/agencyManagement/AddAgency";
import ViewBookTransactions from "../../pages-components/book/book";
import ViewAgency from "../../pages-components/agencyManagement/ViewAgency";
import UserManagement from "../../pages-components/agencyManagement/UserManagement";
import FlightBooking from "../../pages-components/CRM/FlightBooking";
import ProductList from "../../pages-components/Administration/ProductList";
import CommercialPlans from "../../pages-components/Administration/CommercialPlans";
import Migration from "../../pages-components/Administration/Migration";
import CommandBuilder from "../../pages-components/Administration/CommandBuilder";
import BookingEngine from "../../pages-components/BookingEngine";
import AnalyticsDashboard from "../../pages-components/AnalyticsDashboard";
import CustomerStatement from "../../pages-components/Report/CustomerStatement";
import WalletStatement from "../../pages-components/Report/WalletStatement";
import TransactionReports from "../../pages-components/Report/TransactionReports";
import ROE from "../../pages-components/Accounts/ROE";
import PaymentRecipt from "../../pages-components/Accounts/paymentReceipt";
import WalletAdjustment from "../../pages-components/Accounts/walletAdjustment";
import ContentPages from "../../pages-components/CMS/contentPages";
import RoleManagement from "../../pages-components/RoleManagement/RoleManagement";
import UserAccessUnmapping from "../../pages-components/RoleManagement/UserAccessUnmapping";
import DashboardAnalytics from "../../pages-components/AnalyticsDashboard/DashboardAnalytics";
import FareRules from "../../pages-components/Administration/FareRules";
import SalesReports from "../../pages-components/Report/SalesReports";
import { useNavigate } from "react-router-dom";
import SalesInvoice from "../../pages-components/Accounts/SalesInvoice";
import TourInvoice from "../../pages-components/Accounts/TourInvoice";
import AddCustomer from "../../pages-components/Accounts/AddForm";
import AddSupplier from "../../pages-components/Accounts/AddSupplier";
import AllTravellers from "../../pages-components/Accounts/AllTravellers";
import AddGDS from "../../pages-components/Accounts/AddGDS";
import Ledger from "../../pages-components/agencyManagement/Ledger";
import Pricing from "../../pages-components/agencyManagement/Pricing";
import AccountStatement from "../../pages-components/AccountStatement/CustomerAccountStatement";
import CustomerAccountStatement from "../../pages-components/AccountStatement/CustomerAccountStatement";
import SupplierAccountStatement from "../../pages-components/AccountStatement/SupplierAccountStatement";
import CustomerLedger from "../../pages-components/Ledger/CustomerLedger";
import SupplierLedger from "../../pages-components/Ledger/SupplierLedger";
import Umrah from "../../pages-components/Umrah Admin/Umrah/Umrah.jsx";
import Visa from "../../pages-components/Umrah Admin/Visa/Visa";
import Markup from "../b2b/Markup";
import { Hotel } from "@mui/icons-material";
import Transport from "../../pages-components/Umrah Admin/Transport/Transport";
import TransportSection from "../../pages-components/Umrah Admin/Transport/Transport";
import HotelSection from "../../pages-components/Umrah Admin/Hotel/Hotel";


const DashboardMain = () => {
    const selectedOption = useSelector((state) => state.dashboard.option);
    const userData = useSelector((state) => state.user.loginUser)
    const navigate = useNavigate()

    React.useEffect(() => {
        if (userData?.role === "sale" || userData?.role === "SPO" || userData?.role === "agency") {
            navigate("/b2b/searchticket")
        }


    }, [])
    return (
        <div>
            {(selectedOption === "Add Agency" || selectedOption === "Dashboard") && userData.role === "super_admin" && <AddAgency />}
            {selectedOption === "View Agency" && <ViewAgency />}
            {selectedOption === "View Book" && <ViewBookTransactions />}
            {selectedOption === "User Management" && <UserManagement />}
            {selectedOption === "Flight Booking" && <FlightBooking />}
            {selectedOption === "Product List" && <ProductList />}
            {selectedOption === "Commercial Plans" && <CommercialPlans />}
            {selectedOption === "Migration" && <Migration />}
            {selectedOption === "Command Builder" && <CommandBuilder />}
            {selectedOption === "Booking Engine" || selectedOption === "Flight Ticket" && <BookingEngine />}
            {/* {selectedOption === "Dashboard" && <AnalyticsDashboard />} */}
            {/* {selectedOption === "Customer Statement" && <CustomerStatement />} */}
            {selectedOption === "Wallet Statement" && <WalletStatement />}
            {selectedOption === "Transaction Reports" && <TransactionReports />}
            {selectedOption === "ROE" && <ROE />}
            {selectedOption === "Payment Receipt" && <PaymentRecipt />}
            {selectedOption === "Wallet Adjustment" && <WalletAdjustment />}
            {selectedOption === "Content Pages" && <ContentPages />}
            {selectedOption === "Role Management" && <RoleManagement />}
            {selectedOption === "User Access Unmapping" && <UserAccessUnmapping />}
            {selectedOption === "Dashboard" && userData.role !== "super_admin" && <DashboardAnalytics />}
            {selectedOption === "Fare Rule Configuration" && <FareRules />}
            {selectedOption === "Sales Reports" && <SalesReports />}
            {selectedOption === "Sales Invoice" && <SalesInvoice />}
            {selectedOption === "Tour Invoice" && <TourInvoice />}
            {selectedOption === "Customer" && <AddCustomer />}
            {selectedOption === "Supplier" && <AddSupplier />}
            {selectedOption === "GDS" && <AddGDS />}
            {selectedOption === "Travellers" && <AllTravellers />}
            {selectedOption === "Performance Sheet" && <Ledger />}
            {selectedOption === "Customer Statement" && <CustomerAccountStatement />}
            {selectedOption === "Supplier Statement" && <SupplierAccountStatement />}
            {selectedOption === "Customer Ledger" && <CustomerLedger />}
            {selectedOption === "Supplier Ledger" && <SupplierLedger />}
            {selectedOption === "Pricing" && <Pricing />}
            {selectedOption === "Markup" && <Markup />}
            {selectedOption === "Add Umrah" && <Umrah />}
            {selectedOption === "Add Visa" && <Visa />}
            {selectedOption === "Add Hotel" && <HotelSection />}
            {selectedOption === "Add Transport" && <TransportSection />}
        </div>

    );
};

export default DashboardMain;
