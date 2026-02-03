import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import { formatDate } from '../../components/utils';

const TicketTable = ({ ticketInf, genInf }) => {
  console.log(ticketInf, "ticket")
  return (
    <View style={{ display: "flex", flexDirection: "row", width: "100%", height: "20px", marginTop: "10px", borderBottom: "1px solid lightgrey", paddingBottom: "6px" }}>
      <View style={{ width: "50px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{1}</Text></View>

      <View style={{ width: "160px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{genInf?.pax || "NA"}</Text></View>

      <View style={{ width: "130px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{new Date(ticketInf?.invDate).toLocaleDateString()}</Text></View>
      <View style={{ width: "110px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{ticketInf?.pnr || "NA"}</Text></View>

      <View style={{ width: "130px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{ticketInf?.ticketNo || "NA"}</Text></View>

      <View style={{ width: "110px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{ticketInf?.sector || "NA"}</Text></View>

      <View style={{ width: "120", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{ticketInf?.totalFare || "NA"}</Text></View>
    </View>
  )
}

const HotelTable = ({ hotelInf, genInf }) => {
  console.log(hotelInf, "hotel")

  return (
    <View style={{ display: "flex", flexDirection: "row", width: "100%", height: "20px", marginTop: "10px", borderBottom: "1px solid lightgrey", paddingBottom: "2px" }}>

      <View style={{ width: "260px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{genInf?.pax || "NA"}</Text></View>

      <View style={{ width: "270px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{hotelInf?.remarks || "NA"}</Text></View>

      <View style={{ width: "260px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{hotelInf?.refNo || "NA"}</Text></View>

      <View style={{ width: "210px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{hotelInf?.totalHotel || "NA"}</Text></View>
    </View>

  )
}
const VisaTable = ({ visaInf, genInf }) => {
  console.log(visaInf, "visa")

  return (
    <View style={{ display: "flex", flexDirection: "row", width: "100%", height: "20px", marginTop: "10px", borderBottom: "1px solid lightgrey", paddingBottom: "2px" }}>

      <View style={{ width: "260px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{genInf?.pax || "NA"}</Text></View>

      <View style={{ width: "270px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{visaInf?.remarks || "NA"}</Text></View>

      <View style={{ width: "260px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{visaInf?.refNo || "NA"}</Text></View>

      <View style={{ width: "210px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{visaInf?.totalVisa || "NA"}</Text></View>
    </View>

  )
}
const OthersTable = ({ otherInf, genInf }) => {
  console.log(otherInf, "other")
  return (
    <View style={{ display: "flex", flexDirection: "row", width: "100%", height: "20px", marginTop: "10px", borderBottom: "1px solid lightgrey", paddingBottom: "2px" }}>

      <View style={{ width: "260px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{genInf?.pax || "NA"}</Text></View>

      <View style={{ width: "270px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{otherInf?.remarks || "NA"}</Text></View>

      <View style={{ width: "260px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{otherInf?.refNo || "NA"}</Text></View>

      <View style={{ width: "210px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>{otherInf?.totalOthers || "NA"}</Text></View>
    </View>

  )
}


const formattedDate = formatDate(new Date());
const numberToWords = (num) => {
  const belowTwenty = [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const scales = ["", "Thousand", "Million", "Billion"];

  if (num === 0) return "Zero";

  const convertChunk = (n) => {
    if (n < 20) return belowTwenty[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + belowTwenty[n % 10] : "");
    return belowTwenty[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertChunk(n % 100) : "");
  };

  let words = "";
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000; // Take the last three digits
    if (chunk > 0) {
      words = convertChunk(chunk) + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + (words ? " " + words : "");
    }
    num = Math.floor(num / 1000); // Remove the last three digits
    scaleIndex++;
  }

  return words.trim();
};

const InvoicePdf = ({ ticketInf, hotelInf, visaInf, otherInf, genInf, allTotals }) => {
  console.log(genInf, ticketInf, hotelInf, visaInf, otherInf, " data in invoice")
  return (
    <Document>
      <Page size="A4" >
        <View style={{ width: "100%", height: "150px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          <Text style={{ fontWeight: 500, fontSize: "20px" }}>INNOVATION TECH TRAVEL AND TOURISM</Text>
          <View>
            <Text style={{ fontSize: "12px" }}>Johar Town , Lahore</Text>
            <Text style={{ fontSize: "12px" }}>Phone: 052-4268155-56-57</Text>
            <Text style={{ fontSize: "12px" }}>NTN: 3246536-0</Text>


          </View>
          <Text style={{ fontWeight: "800", fontSize: "20px" }}> INVOICE</Text>

        </View>
        <View style={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: "row" }}>
          <View style={{ width: "97%", height: "auto" }}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", height: "70px" }}>
              <View style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "5px" }}>
                <Text style={{ fontSize: "10px" }}>Client: KHAYAM TARIQ (STAFF)</Text>
                <Text style={{ fontSize: "10px" }}>Address: Johar Town , Lahore</Text>
                <Text style={{ fontSize: "10px" }}>Phone: 03218679995, 03338679995</Text>
                <Text style={{ fontSize: "10px" }}>NTN:  3246536-0</Text>
              </View>
              <View style={{ width: "25%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "5px" }}>
                <Text style={{ fontSize: "10px" }}>Print Date: {new Date().toLocaleDateString}</Text>
                <Text style={{ fontSize: "10px" }}>Invoice Number: {genInf?.invNo}</Text>
                <Text style={{ fontSize: "10px" }}>Invoice Date: {new Date(genInf?.invDate).toLocaleDateString()}</Text>
                <Text style={{ fontSize: "10px" }}>Contact To:  </Text>
              </View>
            </View>
            <View style={{ border: "1px solid black", width: "20%", marginTop: "10px", fontSize: "12px" }}><Text>Ticket(s)</Text></View>

            <View style={{ display: "flex", flexDirection: "row", border: "1px solid lightgrey", width: "100%", height: "20px", marginTop: "10px" }}>
              <View style={{ width: "50px", textAlign: "center", borderRight: "1px solid lightgrey", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>Sno</Text></View>

              <View style={{ width: "160px", textAlign: "center", borderRight: "1px solid lightgrey", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>Passenger Name</Text></View>

              <View style={{ width: "130px", textAlign: "center", borderRight: "1px solid lightgrey", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>Departure Date</Text></View>
              <View style={{ width: "110px", textAlign: "center", borderRight: "1px solid lightgrey", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>PNR</Text></View>

              <View style={{ width: "130px", textAlign: "center", borderRight: "1px solid lightgrey", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>Ticket No</Text></View>

              <View style={{ width: "110px", textAlign: "center", borderRight: "1px solid lightgrey", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>Sector</Text></View>

              <View style={{ width: "120px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>Net Amount</Text></View>
            </View>

            <TicketTable ticketInf={ticketInf} />


            <View style={{ border: "1px solid black", width: "20%", marginTop: "10px", fontSize: "12px" }}><Text>Other Services</Text></View>
            <View style={{ display: "flex", flexDirection: "row", border: "1px solid lightgrey", width: "100%", height: "20px", marginTop: "10px" }}>

              <View style={{ width: "260px", textAlign: "center", borderRight: "1px solid lightgrey", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>Passenger Name</Text></View>

              <View style={{ width: "270px", textAlign: "center", borderRight: "1px solid lightgrey", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>Remarks</Text></View>

              <View style={{ width: "260px", textAlign: "center", borderRight: "1px solid lightgrey", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>Reference No.</Text></View>

              <View style={{ width: "210px", textAlign: "center", height: "100%" }}><Text style={{ fontSize: "10px", fontWeight: 500 }}>Net Amount</Text></View>
            </View>
            <HotelTable hotelInf={hotelInf} />
            <VisaTable visaInf={visaInf} />
            <OthersTable otherInf={otherInf} />


            <View style={{ marginTop: "80px" }}>

              <View style={{ width: "100%", borderTop: "1px solid black" }}>
                <View style={{ width: "100%", display: "flex", flexDirection: "row", marginTop: "10px" }}>
                  <Text style={{ width: "60%", fontSize: "10px" }}>{numberToWords(allTotals) || "NA"}</Text>
                  <Text style={{ width: "30%", fontSize: "12px" }}> Invoice Net Value</Text>
                  <Text style={{ width: "10%", fontSize: "12px", float: "right" }}> {allTotals || "NA"}</Text>
                </View>
                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                  <Text style={{ fontSize: "10px", marginTop: "20px", borderBottom: "1px solid black" }}>This is computer generated invoice and does not require any stamp or signature</Text>
                  <Text style={{ fontSize: "10px", marginTop: "20px", }}>For INNOVATION TECH TARVEL AND TOURISM</Text>

                </View>
                <Text style={{ fontSize: "10px", marginTop: "20px", }}>Acknowledgment</Text>

              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )

}

export const generatePDFInvoice = async (ticketData, genInf, hotelInf, otherInf, ticketInf, visaInf, allTotals) => {
  console.log(genInf, ticketInf, hotelInf, visaInf, otherInf, " data")

  const blob = await pdf(<InvoicePdf ticketData={ticketData} genInf={genInf} hotelInf={hotelInf} otherInf={otherInf} ticketInf={ticketInf} visaInf={visaInf} allTotals={allTotals} />).toBlob();
  saveAs(blob, `invoice_.pdf`);
};