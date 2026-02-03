import { Box, Button, Typography } from '@mui/joy'
import React from 'react'

const BoxesDiv = () => {
  return (
    <Box sx={{
      height: "50rem",
      width: "100%",
      backgroundImage: `url("https://s3-alpha-sig.figma.com/img/b2d7/6e9a/44128cc54ece9b521576cd96138d6448?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MbqVkPOuvRtKT80nqyrDHpkFcog1gbkE~NI71yIGcFxxMlVLsy9Mc1i3DQ7evYo8Q7jCMUIXZSVuzSe9qy3wEUVN~9jYPjPjFcKjHbJtOu-Svi5a5ZXnTlCjSPKABDJsqaipnUFxmP9kupbn8orhHJME4Zx-V8vDoFW~BCE9dxnQZ1fb0zRJ4vRh11wXEGSMzBEdYPRiyRecJB3Krbo1re5srA797JTajQqkIybviShLBDE9T-4xMzz78SaCvbaN93I0yojqa6TlgDLjcfh~XItyEdYcJPPamNIQlrzIw~7csqimkMLd6PCa8Bw2ZIB4KYEw24X6O-fZjCFNdrqw7g__")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      position: "relative",
      flexDirection: "column"
    }}
    >
      <Box sx={{
        height: "13rem", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"
      }}>
        <Typography sx={{ color: "#185ea5", fontSize: "36px", fontWeight: "700" }}>The Best Travel Portal in World</Typography>
        <Typography sx={{ color: "#000000", fontSize: "20px", fontWeight: "500" }}>Start your profitable business today!</Typography>
      </Box>

      <Box sx={{
        // backgroundColor:"red",
        width: {
          xs: "100%",
          lg: "65%"
        },
        height: "34rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "20px"
      }}>
        <Box sx={{ width: "55%", height: "48%", backgroundColor: "#FF5757", borderRadius: "10px", opacity: "0.8" }}>
          <Box sx={{ width: "100%", height: "50%", display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
            <Typography sx={{ fontSize: "32px", fontWeight: "700", fontFamily: "Poppins", color: "white" }}>Agency Support</Typography>
            <Box sx={{ width: { xs: "50%", lg: "60%" }, height: "100%" }}></Box>

          </Box>
          <Box sx={{ width: "100%", height: "40%", display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap: { xs: "250px", lg: "300px" } }}>
            <Button sx={{ backgroundColor: "transparent", color: "white", border: "1px solid white", borderRadius: "0px", width: "150px", height: "50px" }}>Learn More</Button>
            <svg width="94" height="68" viewBox="0 0 94 68" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M79.6627 39.4258C85.6034 39.4258 90.4203 34.6121 90.4203 28.6714C90.4203 22.7307 85.6032 17.9137 79.6627 17.9137C73.7235 17.9137 68.9065 22.7307 68.9065 28.6714C68.9067 34.6121 73.7235 39.4258 79.6627 39.4258Z" fill="white" />
              <path d="M93.4367 49.7916C92.9573 46.9114 90.5765 42.8803 88.7744 41.0794C88.537 40.8408 87.4761 40.7856 87.1895 40.9632C84.9986 42.3107 82.4249 43.1037 79.6627 43.1037C76.9036 43.1037 74.3298 42.3107 72.1387 40.9632C71.8509 40.7856 70.7914 40.8408 70.554 41.0794C70.0502 41.5832 69.5006 42.2538 68.9646 43.0316C70.4146 45.7616 71.5645 48.6616 71.9795 51.1588C72.3943 53.6623 72.2597 56.0323 71.5888 58.193C73.9713 59.0549 76.8284 59.4332 79.6626 59.4332C87.0551 59.4332 94.6202 56.87 93.4367 49.7916Z" fill="white" />
              <path d="M46.5035 34.8878C56.1312 34.8878 63.9368 27.0822 63.9368 17.4546C63.9368 7.83007 56.1312 0.0244141 46.5035 0.0244141C36.8774 0.0244141 29.0747 7.83007 29.0747 17.4546C29.0747 27.0822 36.8773 34.8878 46.5035 34.8878Z" fill="white" />
              <path d="M61.265 37.5579C60.8868 37.1813 59.1689 37.085 58.7018 37.3741C55.148 39.5606 50.9775 40.8407 46.5034 40.8407C42.0327 40.8407 37.8601 39.5606 34.3081 37.3741C33.8413 37.0848 32.1234 37.1813 31.7451 37.5579C28.8175 40.4824 24.9591 47.0202 24.1829 51.681C22.2689 63.1614 34.5318 67.3062 46.5034 67.3062C58.4783 67.3062 70.741 63.1614 68.8271 51.681C68.0508 47.0202 64.1924 40.4824 61.265 37.5579Z" fill="white" />
              <path d="M13.8969 39.4258C19.8361 39.4258 24.6529 34.6121 24.6529 28.6714C24.6529 22.7307 19.8361 17.9137 13.8969 17.9137C7.95602 17.9137 3.13916 22.7307 3.13916 28.6714C3.13916 34.6121 7.95602 39.4258 13.8969 39.4258Z" fill="white" />
              <path d="M21.0316 51.1588C21.4728 48.536 22.7174 45.4478 24.2777 42.5923C23.8428 41.9982 23.4081 41.4807 23.0068 41.0794C22.7694 40.8408 21.7099 40.7856 21.4221 40.9632C19.231 42.3107 16.6572 43.1037 13.8968 43.1037C11.1361 43.1037 8.56061 42.3107 6.37128 40.9632C6.08475 40.7856 5.02234 40.8408 4.78497 41.0794C2.97828 42.8801 0.603656 46.9114 0.122701 49.7916C-1.05922 56.87 6.50449 59.433 13.8968 59.433C16.5349 59.433 19.199 59.1083 21.4728 58.3658C20.7563 56.1612 20.6046 53.7357 21.0316 51.1588Z" fill="white" />
            </svg>
          </Box>
        </Box>
        <Box sx={{ width: "27%", height: "48%", backgroundColor: "#0072FF", borderRadius: "10px", opacity: "0.8" }}>
          <Box sx={{ width: "100%", height: "50%", display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
            <Typography sx={{ fontSize: "32px", fontWeight: "700", fontFamily: "Poppins", color: "white" }}>Earn High</Typography>
            <Box sx={{ width: { xs: "20%", lg: "30%" }, height: "100%" }}></Box>

          </Box>
          <Box sx={{ width: "100%", height: "40%", display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
            <Button sx={{ backgroundColor: "transparent", color: "white", border: "1px solid white", borderRadius: "0px", width: "150px", height: "50px" }}>Learn More</Button>
            <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M64.8926 4.41032C64.7792 3.18931 63.8134 2.22175 62.5934 2.10905L39.7133 0.0104252C38.9613 -0.0580063 38.2147 0.213074 37.6819 0.746416L0.744986 37.6835C-0.248329 38.6768 -0.248329 40.2857 0.744986 41.279L25.7198 66.2549C26.7131 67.2484 28.322 67.2484 29.3153 66.2549L66.2543 29.3174C66.7871 28.7846 67.0572 28.0396 66.9894 27.2883L64.8926 4.41032ZM57.3635 14.4338C56.0397 15.7571 53.8942 15.7571 52.5682 14.4338C51.2444 13.1083 51.2444 10.9616 52.5682 9.63721C53.8943 8.31391 56.0399 8.31179 57.3635 9.63721C58.6874 10.9616 58.6874 13.1099 57.3635 14.4338Z" fill="white" />
            </svg>



          </Box>
        </Box>
        <Box sx={{ width: "27%", height: "48%", backgroundColor: "#FFAC27", borderRadius: "10px", opacity: "0.8" }}>
          <Box sx={{ width: "100%", height: "50%", display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>

            <Typography sx={{ fontSize: "32px", fontWeight: "700", fontFamily: "Poppins", color: "white" }}>55K+ Teams</Typography>
            <Box sx={{ width: { xs: "20%", lg: "30%" }, height: "100%" }}></Box>
          </Box>
          <Box sx={{ width: "100%", height: "40%", display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
            <Button sx={{ backgroundColor: "transparent", color: "white", border: "1px solid white", borderRadius: "0px", width: "150px", height: "50px" }}>Learn More</Button>
            <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.9444 9.55556L32.5 3M19.3889 45.6111L45.6111 19.3889M32.5 62L39.0556 55.4444M47.25 55.4444C51.7757 55.4444 55.4444 51.7757 55.4444 47.25C55.4444 42.7243 51.7757 39.0556 47.25 39.0556C42.7243 39.0556 39.0556 42.7243 39.0556 47.25C39.0556 51.7757 42.7243 55.4444 47.25 55.4444ZM17.75 25.9444C22.2757 25.9444 25.9444 22.2757 25.9444 17.75C25.9444 13.2243 22.2757 9.55556 17.75 9.55556C13.2243 9.55556 9.55556 13.2243 9.55556 17.75C9.55556 22.2757 13.2243 25.9444 17.75 25.9444ZM11.1944 62C15.7201 62 19.3889 58.3312 19.3889 53.8056C19.3889 49.2799 15.7201 45.6111 11.1944 45.6111C6.66878 45.6111 3 49.2799 3 53.8056C3 58.3312 6.66878 62 11.1944 62ZM53.8056 19.3889C58.3312 19.3889 62 15.7201 62 11.1944C62 6.66878 58.3312 3 53.8056 3C49.2799 3 45.6111 6.66878 45.6111 11.1944C45.6111 15.7201 49.2799 19.3889 53.8056 19.3889Z" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </Box>
        </Box>
        <Box sx={{ width: "27%", height: "48%", backgroundColor: "#92425D", borderRadius: "10px", opacity: "0.8" }}>
          <Box sx={{ width: "100%", height: "50%", display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
            <Typography sx={{ fontSize: "32px", fontWeight: "700", fontFamily: "Poppins", color: "white" }}>Healthcare</Typography>
            <Box sx={{ width: { xs: "20%", lg: "30%" }, height: "100%" }}></Box>

          </Box>
          <Box sx={{ width: "100%", height: "40%", display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
            <Button sx={{ backgroundColor: "transparent", color: "white", border: "1px solid white", borderRadius: "0px", width: "150px", height: "50px" }}>Learn More</Button>
            <svg width="51" height="75" viewBox="0 0 51 75" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M37 19.4216V27.5784H31.5784V33H23.4216V27.5784H18V19.4216H23.4216V14H31.5784V19.4216H37Z" fill="white" />
              <path d="M47.738 35.5606C49.8153 32.0404 51 27.9498 51 23.5658C51 10.5443 40.4837 0 27.533 0C14.5661 0 4.06601 10.5606 4.06601 23.5658C4.06601 23.6147 4.06601 23.6799 4.06601 23.7288V28.2106L0.235985 33.719C-0.315798 34.5013 0.15484 35.5932 1.07989 35.7399L4.04978 36.2288L5.68889 50.6356C5.85118 52.0698 6.87361 53.2432 8.26929 53.618C10.7685 54.2862 15.2477 55.1662 21.4147 55.1662C21.4147 55.1662 22.2911 70.8279 18.1365 75H25.829V65.2542C25.829 64.6186 26.3321 64.1134 26.965 64.1134C27.5979 64.1134 28.101 64.6186 28.101 65.2542V75H47.4459C47.4459 75 45.5471 69.6545 43.9567 64.146C42.3013 58.4094 42.1066 52.3468 43.3886 46.4961C44.2163 42.6336 45.7256 38.9668 47.738 35.5606ZM28.0848 61.3755C28.0686 61.4407 28.0523 61.5222 28.0199 61.5873C27.9874 61.6525 27.955 61.7177 27.9225 61.7829C27.8738 61.8481 27.8414 61.897 27.7764 61.9622C27.5655 62.1741 27.2733 62.2881 26.965 62.2881C26.8838 62.2881 26.8189 62.2881 26.7378 62.2718C26.6729 62.2555 26.5917 62.2392 26.5268 62.2066C26.4619 62.1741 26.397 62.1415 26.3321 62.1089C26.2671 62.06 26.2185 62.0111 26.1535 61.9622C26.1049 61.9133 26.0562 61.8481 26.0075 61.7829C25.9588 61.7177 25.9263 61.6525 25.9101 61.5873C25.8777 61.5222 25.8614 61.4407 25.8452 61.3755C25.829 61.3103 25.829 61.2288 25.829 61.1473C25.829 61.0658 25.829 61.0007 25.8452 60.9192C25.8614 60.854 25.8777 60.7725 25.9101 60.7073C25.9426 60.6421 25.975 60.5769 26.0075 60.5117C26.0562 60.4465 26.0886 60.3977 26.1535 60.3325C26.2022 60.2836 26.2671 60.2347 26.3321 60.1858C26.397 60.1369 26.4619 60.1043 26.5268 60.0717C26.5917 60.0391 26.6729 60.0228 26.7378 60.0065C27.111 59.9413 27.5005 60.0554 27.7602 60.3162C27.9712 60.528 28.0848 60.8214 28.0848 61.1147C28.101 61.2288 28.0848 61.3103 28.0848 61.3755ZM38.0818 36.0332C35.2417 38.4615 31.5578 39.9283 27.533 39.9283C18.5909 39.9283 11.3203 32.6923 11.2392 23.7288C11.2392 23.6799 11.2392 23.6147 11.2392 23.5658C11.223 14.5209 18.526 7.18709 27.533 7.18709C36.54 7.18709 43.8431 14.5209 43.8431 23.5658C43.8431 28.5528 41.6035 33.0345 38.0818 36.0332Z" fill="white" />
            </svg>


          </Box>
        </Box>
        <Box sx={{ width: "27%", height: "48%", backgroundColor: "#E73F4D", borderRadius: "10px", opacity: "0.8" }}>
          <Box sx={{ width: "100%", height: "50%", display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
            <Typography sx={{ fontSize: "32px", fontWeight: "700", fontFamily: "Poppins", color: "white" }}>Call Center</Typography>
            <Box sx={{ width: { xs: "20%", lg: "30%" }, height: "100%" }}></Box>

          </Box>
          <Box sx={{ width: "100%", height: "40%", display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
            <Button sx={{ backgroundColor: "transparent", color: "white", border: "1px solid white", borderRadius: "0px", width: "150px", height: "50px" }}>Learn More</Button>
            <svg width="75" height="75" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.1159 42.2892C18.3712 42.3744 18.6347 42.4176 18.8991 42.4176H18.8994C19.4704 42.4176 20.0265 42.2118 20.4646 41.8399C21.417 41.0313 21.8675 39.662 21.1717 35.3369C20.5559 31.5019 19.6019 29.4935 17.9827 28.6223C17.6282 28.4313 17.2528 28.3039 16.8639 28.2425C16.8762 21.0946 19.3255 14.4892 23.6001 10.0958C27.2514 6.3416 32.0575 4.3582 37.4997 4.3582C42.9419 4.3582 47.7485 6.3416 51.3997 10.0958C55.6743 14.4892 58.1237 21.0935 58.136 28.2425C57.7471 28.3039 57.3716 28.4313 57.0171 28.6223C55.3979 29.4935 54.4443 31.5019 53.8282 35.3369C53.5649 36.9746 53.4568 38.2415 53.4986 39.2026C52.2388 39.877 49.985 40.7128 46.2375 41.037C45.647 40.0532 44.5941 39.4482 43.4546 39.4482H41.2926C39.4948 39.4482 38.0323 40.9107 38.0323 42.7088C38.0323 44.5069 39.4948 45.9694 41.2926 45.9694H43.4546C44.7264 45.9694 45.8694 45.2382 46.4054 44.094C49.8138 43.8108 52.627 43.1102 54.7711 42.0082C55.1717 42.2766 55.6286 42.4176 56.1006 42.4176C56.367 42.4176 56.6309 42.3744 56.8844 42.2892C58.6088 41.7148 62.2456 37.7843 62.4801 29.2978C62.7206 20.6077 59.8208 12.5021 54.524 7.05688C50.0336 2.44058 44.1467 0 37.4998 0C30.8533 0 24.9663 2.44058 20.4757 7.05688C15.1791 12.5023 12.2792 20.6077 12.5197 29.2978C12.7544 37.7843 16.3912 41.7148 18.1159 42.2892Z" fill="white" />
              <path d="M66.3175 66.9479C65.767 63.9238 63.771 61.3525 60.969 60.0638L49.2433 55.2723C47.3738 54.4136 46.1658 52.5293 46.1658 50.4717V49.5266L45.8567 49.6336C45.0693 49.9066 44.2613 50.0442 43.4546 50.0442H41.2927C37.2479 50.0442 33.9572 46.754 33.9572 42.7087C33.9572 38.6645 37.2479 35.3742 41.2927 35.3742H43.4546C44.9642 35.3742 46.4142 35.8325 47.6482 36.7003L47.7261 36.755L47.8199 36.739C50.4015 36.3136 51.5911 35.638 52.0416 35.3094L52.8126 34.1824C53.5675 31.7565 53.9502 29.4785 53.9502 27.412C53.9502 16.4701 47.0318 8.52844 37.4998 8.52844C27.9679 8.52844 21.0497 16.4702 21.0497 27.412C21.0497 36.4659 28.4032 46.3832 28.4435 46.4185C28.7025 47.1703 28.8339 47.9538 28.8339 48.7454V50.4719C28.8339 52.5293 27.6257 54.4126 25.7655 55.2679L14.0218 60.0684C11.2275 61.3525 9.2312 63.925 8.67939 66.9717L8.05713 75H66.9431L66.3175 66.9479Z" fill="white" />
            </svg>


          </Box>
        </Box>


      </Box>
    </Box>
  )
}

export default BoxesDiv
