import React from 'react'
import './Signup.css'
import Header from '../../pages-components/B2B/Signup/Header'
import Footer from '../../pages-components/B2B/Signup/Footer'
import Contactus from '../../pages-components/B2B/Signup/Contactus'
import FlexiHourTravelAgent from '../../pages-components/B2B/Signup/FlexiHourTravelAgent'

const Signup = () => {
    return (
        <>
            <Header />
            <FlexiHourTravelAgent />
            <Contactus />
            <Footer />
        </>
    )
}

export default Signup