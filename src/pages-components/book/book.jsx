import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Sheet,
  Card,
  CardContent,
  Table,
  Button,
  Divider,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { styled } from "@mui/system";

import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/reducer/loaderSlice";
import axios from "axios";
import { NEXT_PUBLIC_PROD_URL } from "../../env";
export const baseURL = NEXT_PUBLIC_PROD_URL;
import { getAllBook } from "../../server/api";
import { RemoveRedEye, ArrowBack } from "@mui/icons-material";
import { NEXT_PUBLIC_PROD_IMAGE_URL } from "../../env";
import { keyframes } from "@mui/system";

// Define a fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function ViewBookTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [viewAgency, setViewAgency] = useState(true);
  const [fetchedId, setFetchedId] = useState();
  const [agencyName, setAgencyName] = useState();
  const [agencyDetails, setAgencyDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const StyledModalDialog = styled(ModalDialog)(({ theme }) => ({
    maxWidth: "600px",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    backgroundColor: theme.palette.background.paper,
  }));

  const DetailItem = styled(Box)(({ theme }) => ({
    marginBottom: "16px",
    "& strong": {
      color: theme.palette.text.primary,
      fontWeight: "600",
    },
  }));

  const ImageContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "16px",
  }));

  const StyledImage = styled("img")(({ theme }) => ({
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }));

  function TransactionDetailsModal({ open, onClose, transactionDetails }) {
    return (
      <Modal open={open} onClose={onClose}>
        <StyledModalDialog>
          <ModalClose />
          <Typography
            level="h4"
            sx={{ mb: 3, fontWeight: "700", color: "text.primary" }}
          >
            Transaction Details
          </Typography>
          {transactionDetails && (
            <Box>
              <DetailItem>
                <Typography>
                  <strong>Voucher Number:</strong>{" "}
                  {transactionDetails.voucherNumber}
                </Typography>
              </DetailItem>
              <DetailItem>
                <Typography>
                  <strong>Agency Name:</strong>{" "}
                  {transactionDetails.agencyId.agencyName}
                </Typography>
              </DetailItem>
              <DetailItem>
                <Typography>
                  <strong>Type:</strong> {transactionDetails.type}
                </Typography>
              </DetailItem>
              <DetailItem>
                <Typography>
                  <strong>Date:</strong> {transactionDetails.date}
                </Typography>
              </DetailItem>
              <DetailItem>
                <Typography>
                  <strong>Description:</strong>{" "}
                  {transactionDetails.description || "N/A"}
                </Typography>
              </DetailItem>
              <DetailItem>
                <Typography>
                  <strong>Payment Mode:</strong> {transactionDetails.payMode}
                </Typography>
              </DetailItem>
              <DetailItem>
                <Typography>
                  <strong>Cheque No:</strong>{" "}
                  {transactionDetails.chequeNo || "N/A"}
                </Typography>
              </DetailItem>
              <DetailItem>
                <Typography>
                  <strong>Voucher Type:</strong>{" "}
                  {transactionDetails.voucherType}
                </Typography>
              </DetailItem>
              <DetailItem>
                <Typography>
                  <strong>Credit:</strong> {transactionDetails.credit}
                </Typography>
              </DetailItem>
              <DetailItem>
                <Typography>
                  <strong>Debit:</strong> {transactionDetails.debit}
                </Typography>
              </DetailItem>
              {transactionDetails.images &&
                transactionDetails.images.length > 0 && (
                  <Box>
                    <Typography
                      level="h6"
                      sx={{
                        mt: 3,
                        mb: 2,
                        fontWeight: "600",
                        color: "text.primary",
                      }}
                    >
                      Attached Images:
                    </Typography>
                    <ImageContainer>
                      {transactionDetails.images.map((image, idx) => (
                        <StyledImage
                          key={idx}
                          crossorigin="anonymous"
                          src={`${NEXT_PUBLIC_PROD_IMAGE_URL}${image}`}
                          alt={`image-${idx}`}
                          width="120"
                          height="120"
                        />
                      ))}
                    </ImageContainer>
                  </Box>
                )}
            </Box>
          )}
        </StyledModalDialog>
      </Modal>
    );
  }

  const fetchTransactions = async () => {
    dispatch(setLoading(true));
    try {
      const response = await getAllBook();
      setTransactions(response.result || []);
    } catch (error) {
      console.log("Error fetching transactions:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleViewAgencyBook = async (agencyId, agencyName) => {
    setViewAgency(false);
    setFetchedId(agencyId);
    setAgencyName(agencyName);

    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PROD_URL}agency/${agencyId}`
      );
      setAgencyDetails(response.data.result);
    } catch (error) {
      console.log("Error fetching agency details:", error);
    }
  };

  const handleBackToTransactions = () => {
    setViewAgency(true);
    setAgencyDetails(null);
  };

  return (
    <>
      {viewAgency && (
        <Box sx={{ px: 3, py: 4, animation: `${fadeIn} 1s ease-in-out` }}>
          <Typography
            level="h3"
            sx={{
              mb: 3,
              color: "#1976d2",
              fontWeight: "600",
              textAlign: "center",
              letterSpacing: "2px",
            }}
          >
            All Book Transactions
          </Typography>
          <Sheet
            variant="outlined"
            sx={{
              width: "100%",
              borderRadius: "lg",
              overflow: "auto",
              height: "500px",
              boxShadow: 4,
              backgroundColor: "#f5f5f5",
              padding: "20px",
            }}
          >
            <Table
              aria-labelledby="tableTitle"
              sx={{
                borderCollapse: "collapse",
                width: "100%",
                "& th, td": {
                  padding: "12px",
                  textAlign: "center",
                },
              }}
            >
              <thead>
                <tr
                  style={{
                    textTransform: "uppercase",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                  }}
                >
                  <th>Voucher Number</th>
                  <th>Agency Name</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Payment Mode</th>
                  <th>Cheque No</th>
                  <th>Voucher Type</th>
                  <th>Credit</th>
                  <th>Debit</th>
                  <th>Actions</th>
                </tr>
              </thead>

              {transactions.length > 0 && (
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: "#fff",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      <td>{transaction.voucherNumber}</td>
                      <td
                        onClick={() =>
                          handleViewAgencyBook(
                            transaction.agencyId._id,
                            transaction.agencyId.agencyName
                          )
                        }
                        style={{
                          cursor: "pointer",
                          color: "#1976d2",
                          fontWeight: "bold",
                          textDecoration: "underline",
                          "&:hover": {
                            color: "#1565c0",
                          },
                        }}
                      >
                        {transaction.agencyId.agencyName}
                      </td>
                      <td>{transaction.type}</td>
                      <td>{transaction.date}</td>
                      <td>{transaction.amount}</td>
                      <td>{transaction.description || "N/A"}</td>
                      <td>{transaction.payMode}</td>
                      <td>{transaction.chequeNo || "N/A"}</td>
                      <td>{transaction.voucherType}</td>
                      <td>{transaction.credit || "0"}</td>
                      <td>{transaction.debit || "0"}</td>
                      <td>
                        <IconButton
                          sx={{
                            fontSize: "28px",
                            color: "#d32f2f",
                            "&:hover": {
                              color: "#f44336",
                            },
                          }}
                          onClick={() => handleOpenModal(transaction)}
                        >
                          <RemoveRedEye />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </Table>
          </Sheet>
        </Box>
      )}

      {!viewAgency && agencyDetails && (
        <Box
          sx={{
            p: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            animation: `${fadeIn} 1s ease-in-out`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton onClick={handleBackToTransactions} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography
              level="h3"
              sx={{
                fontWeight: "bold",
                color: "#1976d2",
                textAlign: "center",
                letterSpacing: "2px",
              }}
            >
              {agencyName} - Agency Details
            </Typography>
          </Box>
          <Box
            sx={{
              p: 3,
              borderRadius: "10px",
              backgroundColor: "#fff",
              boxShadow: 3,
              mb: 4,
            }}
          >
            <Typography
              level="h6"
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Agency Name: {agencyDetails.agencyName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {agencyDetails.agencyEmail || "N/A"}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {agencyDetails.phoneNumber || "N/A"}
            </Typography>
            <Typography>
              <strong>City:</strong> {agencyDetails.city || "N/A"}
            </Typography>
            <Typography>
              <strong>Country:</strong> {agencyDetails.country || "N/A"}
            </Typography>
          </Box>

          <Typography
            level="h4"
            sx={{ mt: 3, color: "#1976d2", textAlign: "center" }}
          >
            Transactions for {agencyName}
          </Typography>

          {transactions
            .filter((transaction) => transaction.agencyId._id === fetchedId)
            .map((transaction, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: "10px",
                  boxShadow: 4,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: 10,
                  },
                }}
              >
                <CardContent>
                  <Typography
                    level="h5"
                    sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
                  >
                    Voucher: {transaction.voucherNumber}
                  </Typography>
                  <Divider sx={{ my: 1, borderColor: "#1976d2" }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography>
                        <strong>Description:</strong>{" "}
                        {transaction.description || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Payment Mode:</strong> {transaction.payMode}
                      </Typography>
                      <Typography>
                        <strong>Credit:</strong> {transaction.credit}
                      </Typography>
                      <Typography>
                        <strong>Debit:</strong> {transaction.debit}
                      </Typography>
                      <Typography>
                        <strong>Voucher Type:</strong> {transaction.voucherType}
                      </Typography>
                      <Typography>
                        <strong>Type:</strong> {transaction.type}
                      </Typography>
                      <Typography>
                        <strong>Cheque No:</strong>{" "}
                        {transaction.chequeNo || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Date:</strong> {transaction.date}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {transaction.images && transaction.images.length > 0 ? (
                        <Box>
                          <Typography level="h6">Attached Images:</Typography>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            {transaction.images.map((image, idx) => (
                              <img
                                key={idx}
                                crossorigin="anonymous"
                                src={`${NEXT_PUBLIC_PROD_IMAGE_URL}${image}`}
                                alt={`image-${idx}`}
                                width="120"
                                height="120"
                                style={{
                                  borderRadius: "8px",
                                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      ) : (
                        <Typography>No images attached</Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}
      <TransactionDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        transactionDetails={selectedTransaction}
      />
    </>
  );
}
