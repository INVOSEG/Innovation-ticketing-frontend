import React from 'react';
import { Box, Grid, Link, Typography, Container, IconButton, Divider } from '@mui/joy';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const socialMediaLinks = {
  facebook: '#',
  twitter: '#',
  instagram: '#',
};

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#202124',
        color: '#9AA4B2',
        py: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        borderRadius: '16px 16px 0 0',
        width:"100%",
        overflowX: 'hidden',
          }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3}>
          <img
              src={require("../../../src/images/alasamLogo.png")}
              alt="Asam-logo"
              width="250"
              height="80"
              loading="lazy"
              style={{ cursor: "pointer", filter:"invert(100%)"}}
            />
            <Typography variant="h6" color="text.primary" sx={{width:"250px", fontFamily:"Plus Jakarta Sans", fontWeight:"400", fontSize:"16px"}} gutterBottom>
             FlyPass is more than just a flight booking app;it's your one-stop shop for seamless travel experiences.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography sx={{color:"white", fontWeight:"500"}} gutterBottom>
              About Us
            </Typography>
            <Link href="#" color="inherit" display="block" marginY="10px">Promo</Link>
            <Link href="#" color="inherit" display="block" marginY="10px">Help</Link>
            <Link href="#" color="inherit" display="block" marginY="10px">Order</Link>
            <Link href="#" color="inherit" display="block" marginY="10px">Contact</Link>
            <Link href="#" color="inherit" display="block" marginY="10px">FAQ</Link>

          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography sx={{color:"white", fontWeight:"500"}} gutterBottom>
              Resources
            </Typography>
            <Link href="#" color="inherit" display="block" marginY="10px">Documentation</Link>
            <Link href="#" color="inherit" display="block" marginY="10px">Careers</Link>
            <Link href="#" color="inherit" display="block" marginY="10px">Work With Us</Link>
            <Link href="#" color="inherit" display="block" marginY="10px">Blogs & News</Link>
            <Link href="#" color="inherit" display="block" marginY="10px">Affiliate</Link>

          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Typography sx={{color:"white", fontWeight:"500"}} gutterBottom>
              Legal
            </Typography>
            <Link href="#" color="inherit" display="block" marginY="10px">Terms and Condition</Link>
            <Link href="#" color="inherit" display="block"  marginY="10px">Privacy Policy</Link>
            <Link href="#" color="inherit" display="block" marginY="10px">CookiesPolicy</Link>
            <Link href="#" color="inherit" display="block" marginY="10px">Developers</Link>

          </Grid>
          <Grid item xs={6} sm={3} md={2}>
          <Typography sx={{color:"white", fontWeight:"500"}} gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="h6" color="text.primary" sx={{width:"250px", fontFamily:"Plus Jakarta Sans", fontWeight:"400", fontSize:"16px"}} gutterBottom>
flypass@gmail.com
            </Typography>
            <Typography variant="h6" color="text.primary" sx={{width:"250px", fontFamily:"Plus Jakarta Sans", fontWeight:"400", fontSize:"16px"}} gutterBottom>
+12 345 678 09
            </Typography>
            <Typography variant="h6" color="text.primary" sx={{width:"250px", fontFamily:"Plus Jakarta Sans", fontWeight:"400", fontSize:"16px"}} gutterBottom>
Singapore, Indonesia
            </Typography>
            <Typography sx={{color:"white", fontWeight:"500"}} gutterBottom>
              Follow Us On Social
            </Typography>
            <IconButton aria-label="Facebook" color="inherit" component="a" href={socialMediaLinks?.facebook}>
              <FacebookIcon />
            </IconButton>
            <IconButton aria-label="Twitter" color="inherit" component="a" href={socialMediaLinks?.twitter}>
              <TwitterIcon />
            </IconButton>
            <IconButton aria-label="Instagram" color="inherit" component="a" href={socialMediaLinks?.instagram}>
              <InstagramIcon />
            </IconButton>
            <IconButton aria-label="Instagram" color="inherit" component="a" href={socialMediaLinks?.instagram}>
            <FacebookIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Divider></Divider>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 2 }}>
          © 2024 Company Co. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
