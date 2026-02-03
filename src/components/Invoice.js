import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import moment from "moment"

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 2,
    // flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
    marginBottom: 5,
  },
  column: {
    flex: 1,
    padding: 5,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
  },
  value: {
    fontSize: 12,
    color: '#1F2937',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
    padding: 4
  },
});

const FlightInfoTable = ({ flight }) => {
  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Flight Number</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>From</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>To</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Date & Time</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Type</Text>
        </View>
      </View>
      {flight?.map((flightInfo, index) => (
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{`${flightInfo.carrierCode}${flightInfo.number}`}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{flightInfo.departure.iataCode}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{flightInfo.arrival.iataCode}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {moment(flightInfo.departure.at).format('YYYY-MM-DD HH:mm')}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              {index === 0 ? 'Departure' : index === 1 ? 'Arrival' : 'N/A'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
};

const PassengerDetailsTable = ({ travelers }) => (
  <View style={styles.section}>
    <Text style={styles.subheader}>Passenger Details</Text>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCol, { width: '10%' }]}>
          <Text style={styles.tableCell}>Sr No</Text>
        </View>
        <View style={[styles.tableCol, { width: '30%' }]}>
          <Text style={styles.tableCell}>Name</Text>
        </View>
        <View style={[styles.tableCol, { width: '30%' }]}>
          <Text style={styles.tableCell}>Email</Text>
        </View>
        <View style={[styles.tableCol, { width: '15%' }]}>
          <Text style={styles.tableCell}>Phone</Text>
        </View>
        <View style={[styles.tableCol, { width: '15%' }]}>
          <Text style={styles.tableCell}>Gender</Text>
        </View>
      </View>
      {travelers.map((traveler, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '10%' }]}>
            <Text style={styles.tableCell}>{index + 1}</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            <Text style={styles.tableCell}>{`${traveler.name.firstName} ${traveler.name.lastName}`}</Text>
          </View>
          <View style={[styles.tableCol, { width: '30%' }]}>
            <Text style={styles.tableCell}>{traveler.contact?.emailAddress || 'N/A'}</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>{traveler.contact?.phones?.[0]?.number || 'N/A'}</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>{traveler.gender || 'N/A'}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

// InvoicePDF component remains the same
const InvoicePDF = ({ invoiceData, agencyLogoUrl }) => {
  const { flightOffers, travelers, agencyId, _id, createdAt, id } = invoiceData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
          <Text style={{ fontSize: '10px', color: '#6B7280' }}>Date: {moment(createdAt).format('YYYY-MM-DD')}</Text>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image style={styles.logo} src={agencyLogoUrl} />
          <View >
            <Text >{agencyId?.agencyName}</Text>
            <Text style={{ fontSize: '10px' }}>{agencyId?.address}</Text>
            <Text style={{ fontSize: '10px' }} >Ph No: {agencyId?.phoneNumber}</Text>
            <Text style={{ fontSize: '10px' }}>E-mail: {agencyId?.agencyEmail}</Text>
          </View>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <Text style={{ fontSize: '12px', color: '#6B7280' }}>PNR : {id}</Text>
          <Text style={{ fontSize: '12px', color: '#6B7280' }}>Invoice No: {_id}</Text>
        </View>

        {travelers?.length !== 0 && (
          <PassengerDetailsTable travelers={travelers} />
        )}

        {flightOffers?.[0]?.itineraries?.[0]?.segments?.length !== 0 && (
          <View style={styles.section}>
            <Text style={styles.subheader}>Flight Details</Text>
            <FlightInfoTable
              flight={flightOffers?.[0]?.itineraries?.[0]?.segments}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.subheader}>Price Breakdown</Text>
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={styles.total}>Total:</Text>
            <Text style={styles.total}>RS. {invoiceData?.orignalPrice || 0}</Text>
          </View>
        </View>

        <Text style={styles.footer}>Thank you for choosing {agencyId?.agencyName}. We wish you a pleasant flight!</Text>
      </Page>
    </Document>
  );
};

export const generatePDFInvoice = async (invoiceData, agencyLogoUrl) => {
  console.log('INVOICE DATA:', agencyLogoUrl)

  const blob = await pdf(<InvoicePDF invoiceData={invoiceData} agencyLogoUrl={agencyLogoUrl} />).toBlob();
  saveAs(blob, `invoice_${invoiceData.id}.pdf`);
};