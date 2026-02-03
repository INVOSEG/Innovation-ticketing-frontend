import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import moment from 'moment';
const StatementRow = ({ index, data, type }) => {
   return (
      <View key={index} style={{ width: "98%", minHeight: type == "Payment" ? "80px" : "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
         <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}>{type == "Payment" ? data?.invoiceNumber?.invoiceNumber : ""}  {moment(data?.createdAt).format("DD-MM-YYYY")}</Text>
         </View>
         <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}>{type == "Payment" ? "" : data?.travelers[0]?.name?.firstName}{" "}
               {type == "Payment" ? "" : data?.travelers[0]?.name?.lastName}</Text>
         </View>
         <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px", wordWrap: 'break-word' }}>{type == "Payment" ? "" : data?.id}</Text>
         </View>
         <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}>{type == "Payment" ? data?.invoiceNumber?.invoiceNumber : data?.travelers[0]?.ticketNumber}</Text>
         </View>
         <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}>{`${type == "Payment" ? "" : data?.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.iataCode} - ${type == "Payment" ? "" : data?.flightOffers[0]?.itineraries[0]?.segments[0]?.arrival?.iataCode}`}</Text>
         </View>
         <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}>
               {type == "Payment" ? (
                  ` Date: ${moment(data?.invoiceNumber?.generalInformation?.invDate).format("DD-MM-YYYY") || "N/A"}
  Payment Mode: ${data?.invoiceNumber?.generalInformation?.paymentMode || "N/A"}
  Name: ${data?.invoiceNumber?.generalInformation?.name || "N/A"}
  Customer Number: ${data?.invoiceNumber?.generalInformation?.customer || "N/A"}
  Status: ${data?.invoiceNumber?.generalInformation?.status || "N/A"}

`
               ) : (
                  `${moment(data?.flightOffers?.[0]?.itineraries?.[0]?.segments?.[0]?.departure?.at).format("DD-MM-YYYY")}
   ${moment(data?.flightOffers?.[0]?.itineraries?.[0]?.segments?.[1]?.departure?.at).format("DD-MM-YYYY") || "N/A"}`
               )}

            </Text>


         </View>
         <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}>{type == "Payment" ? "" : parseInt(data?.orignalPrice)} </Text>

         </View>
         <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}> </Text>

         </View>
         <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}>{type == "Payment" ? "" : parseInt(data?.totalTax)} </Text>

         </View>
         <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}></Text>

         </View>
         <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}></Text>

         </View>
         <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}></Text>

         </View>
         <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
            <Text style={{ fontSize: "8px" }}>{type == "Payment" ? data?.paidAmount : parseInt(data?.finalPrice)} </Text>

         </View>
      </View>
   )
}

const CustomerAccountStatementPDF = ({ confirmedData, refundedData, paymentData, startDate, endDate, totalOriginalPrice, totalSellPrice, totalOriginalPriceRef, totalSellPriceRef, totalPaymentPrice, totalTaxes, totalTaxesRef }) => {
   console.log(paymentData, " data in invoice")



   return (



      <Document>
         <Page size="A3" >
            <View style={{ width: "100%", height: "75px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>

               <Text style={{ fontWeight: "800", fontSize: "20px" }}> Statement of Account</Text>

            </View>
            <View style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "row" }}>
               <View style={{ width: "97%", height: "auto" }}>
                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", height: "70px" }}>
                     <View style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "5px" }}>
                        <Text style={{ fontSize: "10px" }}>Account:  60041</Text>
                        <Text style={{ fontSize: "10px" }}>Account Name: INNOVATION TECH TRAVEL AND TOURISM</Text>
                        <Text style={{ fontSize: "10px" }}>Statement Period: {startDate} to {endDate}</Text>
                     </View>

                  </View>


               </View>
            </View>
            <View style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}>
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Document Date Document No</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Passenger Name</Text>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>PNR</Text>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Ticket#</Text>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Sector</Text>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Travel Date Return Date</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Fare </Text>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>YQ/YR </Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Total Taxes </Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>CNX </Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>PSF </Text>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Discount </Text>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Sell Price </Text>

                  </View>
               </View>
               {/* <View style={{width:"98%",  minHeight:"50px",maxHeight:"auto", display:"flex", flexDirection:"row", borderBottom:"1px solid lightgrey"}}>
                 <View style={{width:"12%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey", backgroundColor:"lightgrey"}}>
                    <Text style={{fontSize:"8px"}}>OPENING BALANCE</Text>
                 </View>
                 <View style={{width:"14%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>
                 </View>
                 <View style={{width:"12%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>
                 </View>
                 <View style={{width:"8%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>
                 </View>
                 <View style={{width:"8%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>
                 </View>
                 <View style={{width:"10%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"6%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"5%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"6%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"6%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"6%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"7%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>
                    <Text style={{fontSize:"8px"}}>(24.55) </Text>

                 </View>
                 <View style={{width:"8%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                </View> */}
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>SALE</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               {confirmedData.map((data, index) => (
                  <StatementRow data={data} index={index} />
               ))}

               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>TOTAL SALE</Text>

                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>{totalOriginalPrice}</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>0.0</Text>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>0.0</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>{totalTaxes}</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>

                     <Text style={{ fontSize: "8px" }}>0.0</Text>
                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>

                     <Text style={{ fontSize: "8px" }}>0.0</Text>
                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>{totalSellPrice}</Text>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>REFUND</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               {refundedData.map((data, index) => (
                  <StatementRow data={data} index={index} />

               ))}
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>TOTAL REFUND</Text>

                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>{totalOriginalPriceRef}</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>0.0</Text>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>0.0</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>{totalTaxesRef}</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>

                     <Text style={{ fontSize: "8px" }}>0.0</Text>
                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>

                     <Text style={{ fontSize: "8px" }}>0.0</Text>
                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>{totalSellPriceRef}</Text>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>PAYMENTS</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Document Date Document No</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Passenger Name</Text>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>PNR</Text>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Ticket#</Text>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Sector</Text>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Travel Date Return Date</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Fare </Text>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>YQ/YR </Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Total Taxes </Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>CNX </Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>PSF </Text>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Discount </Text>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Sell Price </Text>

                  </View>
               </View>

               {paymentData?.map((data, index) => (
                  <StatementRow data={data} index={index} type={"Payment"} />
               ))}

               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>TOTAL PAYMENTS</Text>

                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>0.0</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>0.0</Text>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>0.0</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>0.0</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>

                     <Text style={{ fontSize: "8px" }}>0.0</Text>
                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>

                     <Text style={{ fontSize: "8px" }}>0.0</Text>
                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>({totalPaymentPrice})</Text>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>NET BALANCE PAYABLE</Text>

                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>-</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>-</Text>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>-</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>-</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>

                     <Text style={{ fontSize: "8px" }}>-</Text>
                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>

                     <Text style={{ fontSize: "8px" }}>-</Text>
                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}> {Number(totalSellPrice) - Number(totalPaymentPrice)}
                     </Text>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Summary</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               {/* <View style={{width:"98%",  minHeight:"50px",maxHeight:"auto", display:"flex", flexDirection:"row", borderBottom:"1px solid lightgrey"}}>
                 <View style={{width:"12%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>
                    <Text style={{fontSize:"8px"}}>OPENING BALANCE</Text>
                 </View>
                 <View style={{width:"14%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>
                 <Text style={{fontSize:"8px"}}>(24.55)</Text>

                 </View>
                 <View style={{width:"12%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>
                 </View>
                 <View style={{width:"8%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>
                 </View>
                 <View style={{width:"8%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>
                 </View>
                 <View style={{width:"10%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"6%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"5%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"6%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"6%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"6%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"7%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                 <View style={{width:"8%", height:"100%", display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderRight:"1px solid lightgrey"}}>

                 </View>
                </View> */}
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>SALE</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>{totalSellPrice}</Text>

                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>REFUND</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>{totalSellPriceRef || 0.0}</Text>

                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>PAYEMENTS</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>{totalPaymentPrice}</Text>

                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
               <View style={{ width: "98%", minHeight: "50px", maxHeight: "auto", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>BALANCE DUE</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>
                        {Number(totalSellPrice) + Number(totalPaymentPrice)}
                     </Text>

                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>
                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey" }}>

                  </View>
               </View>
            </View>
         </Page>
      </Document>
   )

}

export const generateCustomerAccountStatement = async (confirmedData, refundedData, paymentData, startDate, endDate, totalOriginalPrice, totalSellPrice, totalOriginalPriceRef, totalSellPriceRef, totalPaymentPrice, totalTaxes, totalTaxesRef) => {
   console.log(paymentData)
   const blob = await pdf(<CustomerAccountStatementPDF confirmedData={confirmedData}
      refundedData={refundedData}
      startDate={startDate}
      endDate={endDate}
      totalOriginalPrice={totalOriginalPrice}
      totalSellPrice={totalSellPrice}
      totalOriginalPriceRef={totalOriginalPriceRef}
      totalSellPriceRef={totalSellPriceRef}
      totalPaymentPrice={totalPaymentPrice}
      paymentData={paymentData}
      totalTaxes={totalTaxes}
      totalTaxesRef={totalTaxesRef}
   />).toBlob();
   saveAs(blob, `invoice_.pdf`);
};