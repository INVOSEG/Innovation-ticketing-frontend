import * as React from 'react';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import { useSelector } from 'react-redux';


export const NewsLetter = () => {
    const [open, setOpen] = React.useState(false);
    const userData = useSelector(state => state.user.loginUser);
    const isAuthenticated = userData?.id


    React.useEffect(() => {
        if (isAuthenticated) {
            setTimeout(() => setOpen(true), 1000);
            setTimeout(() => setOpen(false), 60000);
        }
    }, [isAuthenticated]);

    return (
        <div>
            {open && (

                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={open}
                    onClose={() => setOpen(false)}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Sheet
                        variant="outlined"
                        sx={{ width: 550,  borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                    >
                        <ModalClose variant="plain" sx={{ m: 1 }} />
                        <img
                            src='https://marketplace.canva.com/EAFJf-gmgNI/1/0/1131w/canva-blue-minimalist-company-newsletter-YEEH8ZrQimQ.jpg'
                            alt='Newsletter'
                            style={{ objectFit: 'contain', width: '100%', borderRadius: '8px' }}
                        />
                    </Sheet>
                </Modal>
            )}
        </div>
    );
};