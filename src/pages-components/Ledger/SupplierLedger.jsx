import { Box, Button, DialogContent, DialogTitle, FormControl,FormLabel, Modal, ModalClose, ModalDialog, Option, Select, Sheet, Table, Typography } from "@mui/joy";
import React, { useEffect, useState } from "react";
import AppDatePicker from "../../components/common/AppDatePicker";
import { AddSupplierLedger, getAllSPO, getSupplierLedgerSearch } from "../../server/api";
import moment from "moment";
import { generateSupplierLedger } from "./SupplierLedgerPDF";
import InputField from "../../components/common/InputField";
import AppTextArea from "../../components/common/AppTextArea";

const SelectSPO = ({ data, selectedSPO, setSelectedSPO }) => {
  return (
    <FormControl size={"lg"} sx={{ width: '20%' }}>
      <FormLabel>Select Supplier</FormLabel>
      <Select defaultValue="all" value={selectedSPO} onChange={(_, value) => setSelectedSPO(value)}>
        <Option value="all">All</Option>
        {data?.map((item, index) => (
          <Option key={index} value={item?._id}>{item?.firstName}</Option>
        ))}
      </Select>
    </FormControl>
  )
}

const SupplierLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [openingBalance, setOpeningBalance] = useState()
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
    const [allSPO, setAllSPO] = useState([])
    const [selectedSPO, setSelectedSPO] = useState('all')
    const [open ,setOpen]= useState(false)
    const [supplierForm, setSupplierForm] = useState({
      platform: "",
      transNo: "",
      chequeNo: "",
      bankName: "",
      refNo: "",
      remarks: "",
      debit: "",
      description: "",
   });
   
    
    const handleChange = (name, value) => {
      setSupplierForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSave = async() => {
      
        try{
         await AddSupplierLedger(supplierForm)
         setOpen(false); 
         console.log("Saved Data:", supplierForm);

        }
        catch(error){
        console.log(error,"error")
        }

    };  

  const handleSupplierLedger = async (ledgerData, startDate, endDate, totalCredited, totalDebited, totalBalance, openingBalance) => {
    try {
      await generateSupplierLedger(
        ledgerData ,startDate, endDate, totalCredited, totalDebited, totalBalance, openingBalance 
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const searchSupplierLedger = async () => {
    try {
      const data = await getSupplierLedgerSearch(startDate, endDate, selectedSPO);
      console.log(data.result);
      setLedgerData(data?.result?.bookings);
      setOpeningBalance(data?.result?.openingBalance)
    } catch (error) {
      console.log("error", error);
      setLedgerData([])
    }
  };

  const handleDateChange = (name, selectedDate) => {
    if (selectedDate === "startDate") {
      const formattedDate = name.toISOString().split("T")[0];

      setStartDate(formattedDate);
    } else if (selectedDate === "endDate") {
      const formattedDate = name.toISOString().split("T")[0];
      setEndDate(formattedDate);
    }
  };

  const fetchAllSPOs = async () => {
    try {
      const res = await getAllSPO();
      if (res?.result) {
        setAllSPO(res.result);
      } else {
        setAllSPO([]); 
      }
    } catch (error) {
      console.error(error.message);
      setAllSPO([]); 
    }
  };
  


  const totalCredited = ledgerData?.reduce((sum, item) => (sum + (item?.credited ? item?.credited : 0) || 0), 0)
  const totalDebited = ledgerData?.reduce((sum, item) => (sum + (item?.debited ? item?.debited : 0) || 0), 0)
  const totalBalance = ledgerData?.at(-1)?.balance;


  useEffect(() => {
    fetchAllSPOs()
  }, [])

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 4, marginTop: "20px" }}>
        <SelectSPO {...{ selectedSPO, setSelectedSPO, data: allSPO }}
        />

        <AppDatePicker
          label="Opening"
          name="startDate"
          date={startDate}
          handleChange={handleDateChange}
        />

        <AppDatePicker
          label="Closing"
          name="endDate"
          date={endDate}
          handleChange={handleDateChange}
        // maxDate={new Date()}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 4, marginTop: "25px" }}>
        <Button
          sx={{ width: "140px" }}
          onClick={() => searchSupplierLedger()}
        >
          Search
        </Button>{" "}
        <Button
          sx={{ width: "140px" }}
          onClick={() => handleSupplierLedger(ledgerData, startDate, endDate, totalCredited, totalDebited, totalBalance, openingBalance)}
        >
          Print
        </Button>
      </Box>

       <Box sx={{ marginTop: "30px" }}>
            <Typography sx={{ fontSize: "22px", fontWeight: "500" }}>
              Supplier Ledger Report
            </Typography>
    
            <Sheet sx={{ marginY: "20px" }}>
           <Box sx={{width:"100%", display:"flex", justifyContent:"flex-end"}}>
            <Button onClick={()=>setOpen(true)} >Add Supplier Ledger</Button>
           </Box>
            <>
      {ledgerData?.length > 0 ? (
        <Table aria-label="ledger table">
          <thead>
            <tr>
              {["Date", "Platform", "Trans No", "Cheque No", "Ref.No", "Description",
                "Remarks", "Debit", "Credit", "Balance"
              ].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ledgerData.map((data, index) => (
              <tr key={index}>
                <td>{moment(data?.createdAt).format("DD-MM-YYYY")}</td>
                <td>{data?.BSP}</td>
                <td style={{ wordWrap: "break-word" }}>{data?.transactionNo || "N/A"}</td>
                <td style={{ wordWrap: "break-word" }}>{data?.chequeNo || "N/A"}</td>
                <td>{data?.refNo || "N/A"}</td>
                <td style={{ wordWrap: "break-word" }}>{data?.description || "N/A"}</td>
                <td style={{ wordWrap: "break-word" }}>{data?.remarks || "N/A"}</td>
                <td>{data?.debited || 0}</td>
                <td>{data?.credited || 0}</td>
                <td>{data?.balance || 0}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Typography variant="h6" textAlign="center">No records found</Typography>
      )}
      
      {ledgerData?.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", my: 2 }}>
          <Box sx={{ width: "20%" }}>
            <Typography variant="h4" fontWeight={600}>Summary</Typography>
            <Typography variant="h6">Opening Balance: {openingBalance}</Typography>

            <Typography variant="h6">Total Debit: {totalDebited}</Typography>
            <Typography variant="h6">Total Credit: {totalCredited}</Typography>
            <Typography variant="h6">Total Balance: {totalBalance}</Typography>
          </Box>
        </Box>
      )}
    </>
                
    
        
            </Sheet>
          </Box>
 <Modal open={open} onClose={() => setOpen(false)} >

 <ModalDialog sx={{width:"750px" , height:"auto"}}>
          <ModalClose />
          <DialogTitle>Supplier Ledger</DialogTitle>
          <DialogContent>
<Box sx={{display:"flex", flexWrap:"wrap", width:"100%", height:"100%", gap:"5px"}}>
  <FormControl fullWidth>
    <FormLabel>Platform</FormLabel>
    <Select
   name="platform"
   value={supplierForm.platform}
   onChange={(_, value) => setSupplierForm(prev => ({ ...prev, platform: value }))}
   sx={{width:"350px"}}
   placeholder="Platform"
 >

      <Option value="Sabre">Sabre</Option>
      <Option value="Amadeus">Amadeus</Option>
      <Option value="Galileo">Galileo</Option>
    </Select>
  </FormControl>

  <InputField
    label="Trans No"
    name="transNo"
    value={supplierForm.transNo}
    onChange={(e)=>handleChange("transNo", e.target.value)}
    sx={{width:"350px"}}

  />
  <InputField
    label="Cheque No"
    name="chequeNo"
    value={supplierForm.chequeNo}
    onChange={(e)=>handleChange("chequeNo", e.target.value)}
    sx={{width:"350px"}}

  />
  <InputField
    label="Bank Name"
    name="bankName"
    value={supplierForm.bankName}
    onChange={(e)=>handleChange("bankName", e.target.value)}
    sx={{width:"350px"}}
    />
  <InputField
    label="Ref No"
    name="refNo"
    value={supplierForm.refNo}
    onChange={(e)=>handleChange("refNo", e.target.value)}
    sx={{width:"350px"}}

  />
  <InputField
    label="Remarks"
    name="remarks"
    value={supplierForm.remarks}
    onChange={(e)=>handleChange("remarks", e.target.value)}
    sx={{width:"350px"}}

  />
  <InputField
    label="Debit"
    name="debit"
    value={supplierForm.debit}
    onChange={(e)=>handleChange("debit", e.target.value)}
    sx={{width:"350px"}}

  />
  <AppTextArea
    label="Description"
    name="description"
    value={supplierForm.description}
    onChange={(e)=>handleChange("description", e.target.value)}
    width="350px"

  />
</Box>
  <Button onClick={handleSave} sx={{my:"10px"}}>Save</Button>
          </DialogContent>
        </ModalDialog>
 
    </Modal>
    </Box>
    
  );
};

export default SupplierLedger;
