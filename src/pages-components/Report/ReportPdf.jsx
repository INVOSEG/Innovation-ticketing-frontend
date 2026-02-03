import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';
import { formatDate } from '../../components/utils';


// Define styles for PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        // fontFamily: 'Open Sans',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottom: '2 solid #334155',
        paddingBottom: 10,
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    logo: {
        width: 60,
        height: 60,
    },
    title: {
        fontSize: 28,
        color: '#1e293b',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    agencyName: {
        fontSize: 14,
        color: '#64748b',
    },
    section: {
        margin: '10 0',
        padding: 15,
        backgroundColor: '#f8fafc',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#334155',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    statBox: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 4,
        width: '48%',
        border: '1 solid #e2e8f0',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 16,
        color: '#334155',
        fontWeight: 'bold',
    },
    table: {
        display: 'table',
        width: '100%',
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#334155',
        color: '#FFFFFF',
        padding: '8 4',
    },
    tableRow: {
        flexDirection: 'row',
        padding: '8 4',
        borderBottom: '1 solid #e2e8f0',
    },
    tableRowEven: {
        backgroundColor: '#f8fafc',
    },
    tableCol: {
        flex: 1,
    },
    tableCell: {
        fontSize: 10,
        padding: '4 8',
    },
    tableHeaderCell: {
        fontSize: 10,
        padding: '4 8',
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        fontSize: 10,
        color: '#94a3b8',
        borderTop: '1 solid #e2e8f0',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

// Format currency
const formatCurrency = (amount) => {
    return `RS. ${Number(amount).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    })}`;
};

// AgencyReport component
const AgencyReport = ({ data, logo, isUserShow, isAgentShow, agentData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>{isUserShow ? 'Agency' : `${data?.userStats?.name}`} Report</Text>
                    <Text style={styles.agencyName}>{data.agencyName || 'Admin Agency'}</Text>
                </View>
                <View style={styles.headerRight}>
                    <Image
                        style={styles.logo}
                        src={logo}
                    />
                </View>
            </View>

            {/* Total Stats Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Total Stats</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Commission</Text>
                        <Text style={styles.statValue}>
                            {formatCurrency(isUserShow ? data.totalStats.totalCommission : data?.userStats?.totalCommission)}
                        </Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Earnings</Text>
                        <Text style={styles.statValue}>
                            {formatCurrency(isUserShow ? data.totalStats.totalEarnings : data?.userStats?.totalEarnings)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Ticket Status Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ticket Status Counts</Text>
                <View style={styles.statsGrid}>
                    {Object.entries(isUserShow ? data.totalStats.ticketStatusCounts : data.userStats?.tickets).map(([status, count]) => (
                        <View key={status} style={styles.statBox}>
                            <Text style={styles.statLabel}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                            <Text style={styles.statValue}>{count}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* User Stats Table */}
            {isUserShow && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Stats</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>Name</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>Role</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>Total Earnings</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>Total Commission</Text>
                            </View>
                        </View>
                        {data.userStats.map((user, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.tableRow,
                                    index % 2 === 1 && styles.tableRowEven
                                ]}
                            >
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{user.name}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {formatCurrency(user.totalEarnings)}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {formatCurrency(user.totalCommission)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Agent Table */}
            {isAgentShow && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Agent Booking Details</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>Traveller Name</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>Price</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>Created On</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>Booking Date</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>Airline Code</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>PNR</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableHeaderCell}>Status</Text>
                            </View>
                        </View>
                        {agentData?.map((row, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.tableRow,
                                    index % 2 === 1 && styles.tableRowEven
                                ]}
                            >
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{row.travelers[0]?.name?.lastName || row.travelers[0]?.name?.firstName ? `${row.travelers[0]?.name?.lastName}/${row.travelers[0]?.name?.firstName}` : 'N/A'}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {row?.finalPrice ? `RS. ${row?.finalPrice}` : 'N/A'}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {row.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.at ? formatDate(row.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.at) : 'N/A'}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {row.createdAt ? formatDate(row.createdAt) : 'N/A'}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {row.flightOffers[0]?.itineraries[0]?.segments[0]?.operating?.carrierCode && row.flightOffers[0]?.itineraries[0]?.segments[0].carrierCode ? `${row.flightOffers[0]?.itineraries[0]?.segments[0]?.operating?.carrierCode}-${row.flightOffers[0]?.itineraries[0]?.segments[0].carrierCode}` : row.flightOffers[0]?.itineraries[0]?.segments[0]?.carrierCode && row.flightOffers[0]?.itineraries[0]?.segments[0].number ? `${row.flightOffers[0]?.itineraries[0]?.segments[0]?.carrierCode}-${row.flightOffers[0]?.itineraries[0]?.segments[0].number}` : 'N/A'}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {row.id ? row.id : 'N/A'}
                                    </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>
                                        {row?.status === "hold" ? "Hold" : row?.status === "canceled" ? "Cancelled" : row?.status === "voided" ? "Voided" : row?.status === "confirmed" ? "Confirmed" : row?.status === "refunded" ? "Refunded" : "N/A"}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Generated on: {new Date().toLocaleDateString()}</Text>
                <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
            </View>
        </Page>
    </Document>
);

export const generatePDFReport = async (data, logo, isUserShow, isAgentShow, agentData) => {
    // console.log('INVOICE DATA:', agencyLogoUrl)
    console.log(data)

    const blob = await pdf(<AgencyReport data={data} logo={logo} isUserShow={isUserShow} isAgentShow={isAgentShow} agentData={agentData} />).toBlob();
    saveAs(blob, `invoice_${data.agencyId}.pdf`);
};