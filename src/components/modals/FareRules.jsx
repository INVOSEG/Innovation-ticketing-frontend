import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';

const fareRulesDummy = [
    {
        "originAirportCode": "LHE",
        "destinationAirportCode": "KHI",
        "owningAirlineCode": "EK",
        "passengerCode": "ADT",
        "isRefundable": true,
        "refundPenalties": [
            {
                "applicability": "BEFORE_DEPARTURE",
                "conditionsApply": false,
                "penalty": {
                    "amount": "0",
                    "currencyCode": "PKR"
                }
            },
            {
                "applicability": "AFTER_DEPARTURE",
                "conditionsApply": false,
                "penalty": {
                    "amount": "0",
                    "currencyCode": "PKR"
                }
            }
        ],
        "isChangeable": true,
        "exchangePenalties": [
            {
                "applicability": "BEFORE_DEPARTURE",
                "conditionsApply": false,
                "penalty": {
                    "amount": "0",
                    "currencyCode": "PKR"
                }
            },
            {
                "applicability": "AFTER_DEPARTURE",
                "conditionsApply": false,
                "penalty": {
                    "amount": "0",
                    "currencyCode": "PKR"
                }
            }
        ]
    },
    {
        "originAirportCode": "ISB",
        "destinationAirportCode": "DXB",
        "owningAirlineCode": "PK",
        "passengerCode": "CHD",
        "isRefundable": false,
        "refundPenalties": [],
        "isChangeable": true,
        "exchangePenalties": [
            {
                "applicability": "BEFORE_DEPARTURE",
                "conditionsApply": true,
                "penalty": {
                    "amount": "1000",
                    "currencyCode": "PKR"
                }
            }
        ]
    }
];

export default function FareRules({ open, setOpen, fareRule }) {
    return (
        <React.Fragment>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog" sx={{ width: 800, height: 500 }}>
                    <DialogTitle>
                        Fare Rules Details
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {fareRule.map((fareRules, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <div>
                                    <strong>Traveler {index + 1}:</strong>
                                </div>
                                <div>
                                    <strong>Origin:</strong> {fareRules.originAirportCode}
                                </div>
                                <div>
                                    <strong>Destination:</strong> {fareRules.destinationAirportCode}
                                </div>
                                <div>
                                    <strong>Airline:</strong> {fareRules.owningAirlineCode}
                                </div>
                                <div>
                                    <strong>Passenger Code:</strong> {fareRules.passengerCode}
                                </div>
                                <Divider style={{ margin: '10px 0' }} />
                                <div>
                                    <strong>Refundable:</strong> {fareRules.isRefundable ? 'Yes' : 'No'}
                                </div>
                                {fareRules.isRefundable && fareRules.refundPenalties.length > 0 && (
                                    <div>
                                        <strong>Refund Penalties:</strong>
                                        <ul>
                                            {fareRules.refundPenalties.map((penalty, idx) => (
                                                <li key={idx}>
                                                    <strong>{penalty.applicability}:</strong> {penalty.penalty.amount} {penalty.penalty.currencyCode}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div>
                                    <strong>Changeable:</strong> {fareRules.isChangeable ? 'Yes' : 'No'}
                                </div>
                                {fareRules.isChangeable && fareRules.exchangePenalties.length > 0 && (
                                    <div>
                                        <strong>Exchange Penalties:</strong>
                                        <ul>
                                            {fareRules.exchangePenalties.map((penalty, idx) => (
                                                <li key={idx}>
                                                    <strong>{penalty.applicability}:</strong> {penalty.penalty.amount} {penalty.penalty.currencyCode}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="plain" color="danger" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
