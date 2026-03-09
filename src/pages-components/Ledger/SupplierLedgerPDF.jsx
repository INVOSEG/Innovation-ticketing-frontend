import React from 'react';
import { Document, Page, Text, View, pdf, } from '@react-pdf/renderer';
import moment from 'moment';

const StatementRow = ({ index, data }) => {
   return (
      <View key={index} style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey", marginBottom: "20px" }}>
         <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "10px" }}> {moment(data?.createdAt).format("DD-MM-YYYY")}</Text>
         </View>
         <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "10px" }}>{data?.transactionNo || 'N/A'}</Text>
         </View>
         <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "10px", wordWrap: 'break-word' }}>{data?.chequeNO || 'N/A'}</Text>
         </View>
         <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "10px" }}>{data?.refNo || 'N/A'}</Text>
         </View>
         <View style={{ width: "17%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "10px" }}>{data?.description || 'N/A'}
            </Text>
         </View>

         <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "10px" }}>{data?.remarks || 'N/A'}</Text>

         </View>
         <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "10px" }}>{data?.debited || 0} </Text>

         </View>
         <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "10px" }}>{data?.credited || 0} </Text>

         </View>

         <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "10px" }}>{data?.balance || 0} </Text>

         </View>
      </View>
   )
}

const SupplierLedgerPDF = ({ ledgerData, startDate, endDate, totalCredited, totalDebited, totalBalance, openingBalance }) => {


   return (



      <Document>
         <Page size="A3" >

            <View style={{ width: "100%", height: "175px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
               <Text style={{ fontWeight: "800", fontSize: "20px" }}> Al-Saboor TRAVEL AND TOURISM</Text>
               <Text style={{ fontWeight: "800", fontSize: "16px" }}> OPP, HAZVARD GRAMMER SCHOOL, KUTCHERY ROAD, SIALKOT, PAKISTAN</Text>
               <Text style={{ fontWeight: "800", fontSize: "12px" }}> 052-4268155-56-57</Text>
               <Text style={{ fontWeight: "800", fontSize: "12px" }}> NTN: 3246536-0</Text>

               <Text style={{ fontWeight: "800", fontSize: "18px" }}>Supplier Ledger Report</Text>

            </View>
            <View style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "row" }}>
               <View style={{ width: "97%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "45%", height: "70px" }}>
                     <View style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "5px" }}>
                        <Text style={{ fontSize: "12px" }}>Supplier: BSP</Text>
                        <Text style={{ fontSize: "12px" }}>Account: 25100000</Text>
                     </View>

                  </View>
                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", width: "45%", height: "70px" }}>
                     <View style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "5px" }}>

                        <Text style={{ fontSize: "12px" }}>Statement Period: {startDate} to {endDate}</Text>
                        <Text style={{ fontSize: "12px" }}>Print Date : {moment(new Date()).format("DD-MM-YYYY")}</Text>
                     </View>

                  </View>

               </View>

            </View>

            <View style={{ width: "100%", height: "auto", display: "flex", alignItems: "center", flexDirection: "column" }}>
               <View style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "10px" }}>Date</Text>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "10px" }}>Trans. No</Text>

                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "10px" }}>Cheque No.</Text>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "10px" }}>Ref. No</Text>
                  </View>
                  <View style={{ width: "17%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "10px" }}>Description</Text>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "10px" }}>Remarks</Text>
                  </View>

                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "10px" }}>Debit </Text>

                  </View>

                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "10px" }}>Credit </Text>

                  </View>

                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "10px" }}>Balance </Text>

                  </View>
               </View>

               {ledgerData.map((data, index) => (
                  <StatementRow data={data} index={index} />
               ))}



               <View style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "10px" }}>
                  <Text style={{ fontSize: "22px" }}>Summary</Text>
               </View>
               <View style={{ width: "98%", height: "160px", display: "flex", flexDirection: "row", justifyContent: "center", alignContent: "center" }}>
                  <View style={{ width: "60%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                     <View style={{ width: "25%", height: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Text style={{ fontSize: "12px" }}>Opening Balance</Text>
                        <Text style={{ fontSize: "12px" }}>Total Debit</Text>
                        <Text style={{ fontSize: "12px" }}>Total Credit</Text>
                        <Text style={{ fontSize: "12px" }}>Total Closing Balance</Text>



                     </View>
                     <View style={{ width: "25%", height: "100%", display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
                        <Text style={{ fontSize: "12px" }}>{openingBalance}</Text>
                        <Text style={{ fontSize: "12px" }}>{totalDebited || "N/A"}</Text>
                        <Text style={{ fontSize: "12px" }}>{totalCredited || "N/A"}</Text>
                        <Text style={{ fontSize: "12px" }}>{totalBalance}</Text>


                     </View>

                  </View>

               </View>
            </View>
         </Page>
      </Document>
   )

}

export const generateSupplierLedger = async (ledgerData, startDate, endDate, totalCredited, totalDebited, totalBalance, openingBalance) => {

   const blob = await pdf(
      <SupplierLedgerPDF
         ledgerData={ledgerData}
         startDate={startDate}
         endDate={endDate}
         totalDebited={totalDebited}
         totalCredited={totalCredited}
         totalBalance={totalBalance}
         openingBalance={openingBalance}
      />
   ).toBlob();
   saveAs(blob, `invoice_.pdf`);
};