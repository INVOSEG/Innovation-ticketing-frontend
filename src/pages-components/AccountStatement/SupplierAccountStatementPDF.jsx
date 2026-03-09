import React from 'react';
import { Document, Page, Text, View, pdf, } from '@react-pdf/renderer';
import moment from 'moment';

const StatementRow = ({ index, data }) => {
   return (
      <View key={index} style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey", marginBottom: "20px" }}>
         <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}> {moment(data?.createdAt).format("DD-MM-YYYY")}</Text>
         </View>
         <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>E</Text>
         </View>
         <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px", wordWrap: 'break-word' }}>{data?._id}</Text>
         </View>
         <View style={{ width: "22%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{data?.travelers[0]?.name?.firstName}{" "}
               {data?.travelers[0]?.name?.lastName}</Text>
         </View>
         <View style={{ width: "18%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{data?.travelers[0]?.ticketNumber}{" "}
            </Text>
         </View>

         <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{`${data?.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.iataCode} - ${data?.flightOffers[0]?.itineraries[0]?.segments[0]?.arrival?.iataCode}`}</Text>

         </View>
         <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{parseInt(data?.orignalPrice)} </Text>

         </View>
         <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{parseInt(data?.totalTax)} </Text>

         </View>

         <View style={{ width: "11%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{parseInt(data?.finalPrice)} </Text>

         </View>
      </View>
   )
}

const StatementRowPay = ({ index, data }) => {
   return (
      <View key={index} style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
         <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{moment(data?.createdAt).format("DD-MM-YYYY")}</Text>
         </View>
         <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{data?.invoiceNumber?.invoiceNumber}</Text>
         </View>
         <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}></Text>
         </View>
         <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{`Payment Mode: ${data?.invoiceNumber?.generalInformation?.paymentMode} Payment by:  ${data?.invoiceNumber?.generalInformation?.name} Agent Id: ${data?.invoiceNumber?.generalInformation?.customer}`}</Text>
         </View>
         <View style={{ width: "20%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{data?.invoiceNumber?.generalInformation?.remarks}</Text>
         </View>
         <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>{data?.paidAmount}</Text>

         </View>
         <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: "8px" }}>0.0 </Text>

         </View>

      </View>
   )
}
const SupplierAccountStatementPDF = ({ confirmedData, refundedData, paymentData, startDate, endDate, totalOriginalPrice, totalSellPrice, totalOriginalPriceRef, totalSellPriceRef, totalPaymentPrice, totalTaxes, totalTaxesRef }) => {
   console.log(paymentData, " data in invoice")



   return (



      <Document>
         <Page size="A3" >

            <View style={{ width: "100%", height: "175px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
               <Text style={{ fontWeight: "800", fontSize: "20px" }}> Al-Saboor TRAVEL AND TOURISM</Text>
               <Text style={{ fontWeight: "800", fontSize: "16px" }}> OPP, HAZVARD GRAMMER SCHOOL, KUTCHERY ROAD, SIALKOT, PAKISTAN</Text>
               <Text style={{ fontWeight: "800", fontSize: "12px" }}> 052-4268155-56-57</Text>
               <Text style={{ fontWeight: "800", fontSize: "12px" }}> NTN: 3246536-0</Text>

               <Text style={{ fontWeight: "800", fontSize: "18px" }}>Supplier Statement of Account</Text>

            </View>
            <View style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "row" }}>
               <View style={{ width: "97%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "45%", height: "70px" }}>
                     <View style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "5px" }}>
                        <Text style={{ fontSize: "12px" }}>BSP</Text>
                        <Text style={{ fontSize: "12px" }}>Phone</Text>
                        <Text style={{ fontSize: "12px" }}>Address</Text>
                     </View>

                  </View>
                  <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", width: "45%", height: "70px" }}>
                     <View style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "5px" }}>

                        <Text style={{ fontSize: "12px" }}>Statement Period: {startDate} to {endDate}</Text>
                        <Text style={{ fontSize: "12px" }}>Print Date : 20025-2-20</Text>
                     </View>

                  </View>

               </View>

            </View>
            <View style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "auto" }}>
               <View style={{ textAlign: "center", width: "98%", backgroundColor: "lightgrey" }}>
                  <Text style={{ fontWeight: "800", fontSize: "18px" }}>Sales Invoices</Text>

               </View>
               <View style={{ textAlign: "center", width: "98%", border: "lightgrey", marginTop: "5px", marginBottom: "10px" }}>
                  <Text style={{ fontWeight: "800", fontSize: "16px" }}>Ticket Booking</Text>

               </View>
            </View>
            <View style={{ width: "100%", height: "auto", display: "flex", alignItems: "center", flexDirection: "column" }}>
               <View style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Date</Text>
                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Our XO </Text>

                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Invoice</Text>
                  </View>
                  <View style={{ width: "22%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Passenger Name</Text>
                  </View>
                  <View style={{ width: "18%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Ticket#</Text>
                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Sector</Text>
                  </View>

                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Fare </Text>

                  </View>

                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Taxes </Text>

                  </View>

                  <View style={{ width: "11%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Net </Text>

                  </View>
               </View>

               {confirmedData.map((data, index) => (
                  <StatementRow data={data} index={index} />
               ))}

               <View style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Sale</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{confirmedData?.length}</Text>

                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Conj</Text>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>0</Text>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Void</Text>

                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>0</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Total</Text>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{confirmedData?.length}</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Total</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{totalOriginalPrice}</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{totalTaxes}</Text>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{totalSellPrice}</Text>

                  </View>

               </View>


               <View style={{ textAlign: "center", width: "98%", backgroundColor: "lightgrey", height: "auto" }}>
                  <Text style={{ fontWeight: "800", fontSize: "18px" }}>Refund Invoices</Text>

               </View>
               <View style={{ textAlign: "center", width: "98%", border: "lightgrey", marginTop: "5px", marginBottom: "10px" }}>
                  <Text style={{ fontWeight: "800", fontSize: "16px" }}>Ticket Booking</Text>

               </View>
               {refundedData.map((data, index) => (
                  <StatementRow data={data} index={index} />

               ))}
               <View style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Refund</Text>
                  </View>
                  <View style={{ width: "14%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{refundedData?.length}</Text>

                  </View>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Conj</Text>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>0</Text>

                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Void</Text>

                  </View>
                  <View style={{ width: "10%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>0</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Total</Text>

                  </View>
                  <View style={{ width: "5%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{refundedData?.length}</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Total</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{totalOriginalPriceRef}</Text>

                  </View>
                  <View style={{ width: "6%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{totalTaxesRef}</Text>

                  </View>
                  <View style={{ width: "7%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{totalSellPriceRef}</Text>

                  </View>

               </View>
               <View style={{ textAlign: "center", width: "98%", height: "20px", backgroundColor: "lightgrey", marginTop: "10px", marginBottom: "10px" }}>
                  <Text style={{ fontWeight: "800", fontSize: "18px" }}>Vouchers</Text>

               </View>

               <View style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Date</Text>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Voucher No.</Text>
                  </View>
                  <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Reference</Text>
                  </View>
                  <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Cheque No.</Text>
                  </View>
                  <View style={{ width: "20%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Description</Text>
                  </View>
                  <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Debit</Text>

                  </View>
                  <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRight: "1px solid lightgrey", backgroundColor: "lightgrey" }}>
                     <Text style={{ fontSize: "8px" }}>Credit </Text>

                  </View>

               </View>

               {paymentData?.map((data, index) => (
                  <StatementRowPay data={data} index={index} />
               ))}


               <View style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row" }}>
                  <View style={{ width: "12%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}></Text>
                  </View>
                  <View style={{ width: "8%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}></Text>
                  </View>
                  <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}></Text>
                  </View>
                  <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}></Text>
                  </View>
                  <View style={{ width: "20%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>Total</Text>
                  </View>
                  <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>{totalPaymentPrice}</Text>

                  </View>
                  <View style={{ width: "15%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                     <Text style={{ fontSize: "8px" }}>0.0 </Text>

                  </View>

               </View>


               <View style={{ width: "98%", height: "50px", display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "10px" }}>
                  <Text style={{ fontSize: "22px" }}>Summary</Text>
               </View>
               <View style={{ width: "98%", height: "160px", display: "flex", flexDirection: "row", justifyContent: "center", alignContent: "center" }}>
                  <View style={{ width: "60%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                     <View style={{ width: "25%", height: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <Text style={{ fontSize: "12px" }}>Opening Balance</Text>
                        <Text style={{ fontSize: "12px" }}>Add Sales Invoices</Text>
                        <Text style={{ fontSize: "12px" }}>Less Refund Invoices</Text>
                        <Text style={{ fontSize: "12px" }}>Add Receipts</Text>
                        <Text style={{ fontSize: "12px" }}>Less Payments</Text>
                        <Text style={{ fontSize: "12px", border: "1px solid lightgrey" }}>Net Balance</Text>


                     </View>
                     <View style={{ width: "25%", height: "100%", display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
                        <Text style={{ fontSize: "12px" }}>N/A</Text>
                        <Text style={{ fontSize: "12px" }}>{totalSellPrice}</Text>
                        <Text style={{ fontSize: "12px" }}>{totalSellPriceRef}</Text>
                        <Text style={{ fontSize: "12px" }}>0.0</Text>
                        <Text style={{ fontSize: "12px" }}>{totalPaymentPrice}</Text>
                        <Text style={{ fontSize: "12px" }}>{Number(totalSellPrice) - Number(totalSellPriceRef)}</Text>

                     </View>

                  </View>

               </View>
            </View>
         </Page>
      </Document>
   )

}

export const generateSupplierAccountStatement = async (confirmedData, refundedData, paymentData, startDate, endDate, totalOriginalPrice, totalSellPrice, totalOriginalPriceRef, totalSellPriceRef, totalPaymentPrice, totalTaxes, totalTaxesRef) => {
   console.log(paymentData)
   const blob = await pdf(<SupplierAccountStatementPDF confirmedData={confirmedData}
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