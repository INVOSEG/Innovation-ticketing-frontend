import * as React from 'react';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';

export default function FlightRulesModal({ openFlightRule, setOpenFlightRule, selectedFlightRules }) {
    const detailedFareRules = selectedFlightRules?.included?.['detailed-fare-rules'];
    console.log("detailedFareRules", detailedFareRules)
    return (
        <React.Fragment>
            <Modal open={openFlightRule} onClose={() => setOpenFlightRule(false)}>
                <ModalDialog layout="fullscreen">
                    <ModalClose />
                    <DialogTitle>Flight Rules</DialogTitle>
                    <DialogContent>
                        <div>
                            {detailedFareRules && Object.values(detailedFareRules).map((notes, index) => (
                                <div key={index}>
                                    {notes.fareNotes?.descriptions?.map((description, descIndex) => (
                                        <div key={descIndex}>
                                            
                                            {description.text}  
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </DialogContent>


                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
