import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import CreateIcon from '@mui/icons-material/Create';

import generateAndSetNewTokens from '../helper/generateAndSetNewTokens';
import { fetchUserData, logoutUser, updateProfile } from '../store/UserSlice';

const Account = ({ setOpenAccount }: { setOpenAccount: (openAccount: boolean) => void }) => {
  const fileInputRef: any = useRef(null);
  const accountRef: any = useRef(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(true)
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    picture: ""
  })

  const user_id = useSelector((state: any) => state.user.userId)

  useEffect(() => {
    const fetchUserDataFunction = async () => {
      let response: any;
      //@ts-ignore
      response = await dispatch(fetchUserData());

      if (response.payload === 'token expired') {
        try {
          await generateAndSetNewTokens();

          //@ts-ignore
          response = dispatch(fetchUserData());
        } catch (error: any) {
          if (error && error.response.status === 403) {
            //@ts-ignore
            dispatch(logoutUser())
            localStorage.removeItem('access_token');
            alert('unauthenticated : Token expired');
            return
          } else console.log(error);
        }
      } else if (response?.error) {
        alert("Unauthorized Access: Your credentials are invalid or expired. Please log in again")
        return
      }
      if (response.payload) {
        setUserData({
          username: response.payload.username,
          email: "test@test.com",
          picture: response.payload.image
        })
      }
      setLoading(false)
    };
    fetchUserDataFunction();
  }, [])
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setOpenAccount(false)
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleChange = (e: any) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }
  const handleEmailUpdate = () => {
    console.log("updated");
  }
  const handlePictureWrapClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileInputChange = (event: any) => {
    const selectedFile = event.target.files[0];

    // Handle the selected file as needed (e.g., upload to server, update state, etc.)
    console.log('Selected file:', selectedFile);
  };
  const handleUpdateData = async (e: any) => {
    e.preventDefault();
    const obj = {
      user_id,
      updatedValues: userData
    }
    //@ts-ignore
    await dispatch(updateProfile(obj))
    setOpenAccount(false)

    if (loading) {
      return null
    }
  }
  useEffect(() => {
    console.log(loading);
  }, [loading])
  return (
    <AccountWrapper>
      <AccountBox>
        <Box ref={accountRef}>
          <DetailsWrapper>
            <AccountTitle>Account</AccountTitle>
            <Details>
              <PictureWrapper>
                <PictureWrap onClick={handlePictureWrapClick}>
                  <Picture src={userData.picture} alt="User image" />
                  <HiddenInput
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                  />
                </PictureWrap>
              </PictureWrapper>
              <InputDetails>
                <UsernameInput name="username" type="text" placeholder="name" value={userData.username} onChange={handleChange} />
                <EmailInput>
                  <Email name="email" type="email" value={userData.email} onChange={handleChange} />
                  <EditIcon>
                    <CreateIcon style={{ width: '16px', opacity: '0.5' }} onClick={handleEmailUpdate} />
                  </EditIcon>
                </EmailInput>
              </InputDetails>
            </Details>
          </DetailsWrapper>
          <ButtonGroup>
            <CancelButton onClick={() => setOpenAccount(false)}>Cancel</CancelButton>
            <SaveButton onClick={(e: any) => handleUpdateData(e)}>Save</SaveButton>
          </ButtonGroup>
        </Box>
      </AccountBox>
    </AccountWrapper>
  );
};

const AccountWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100vh;
  z-index: 2147483647;
  pointer-events: auto;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  transition: all 0.2s ease-in 0s;
  overflow: hidden scroll;
  padding: 48px 0px 58px;
  box-sizing: border-box;
  font-family: roboto;
`;
const AccountBox = styled.div`
  color: rgb(34, 34, 34);
  border-radius: 8px;
  background-color: white;
  position: relative;
  max-width: 500px;
  width: 95%;
  z-index: 2147483647;
  border-top: 1px solid rgb(239, 239, 239);
  border-bottom: 1px solid rgb(239, 239, 239);
  margin: auto;
  transition: all 0.2s ease-in 0s;
  transform: translateY(20px);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 3px 6px;
  overflow: hidden;
  display: block;
`;
const Box = styled.div`
  position: relative;
  max-width: 780px;
  margin: auto;
`;
const DetailsWrapper = styled.div`
  padding: 20px 20px 0px;
`;
const AccountTitle = styled.div`
  font-size: 16px;
  color: rgb(187, 187, 187);
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 16px;
`;
const Details = styled.div`
  display: flex;
  padding-top: 10px;
  padding-bottom: 14px;
  align-items: flex-start;
`;
const PictureWrapper = styled.div`
  display: flex;
`;
const PictureWrap = styled.div`
  cursor: pointer;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  border-radius: 50%;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  border: 2px dotted rgb(170, 170, 170);

`;
const Picture = styled.img`
  border-radius: 50%;
  width: 80px;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;
const HiddenInput = styled.input`
display:none;
&:hover {
    background:black;
  }
`
const InputDetails = styled.div`
  margin-left: 28px;
`;
const UsernameInput = styled.input`
  padding: 0.1em 0em;
  box-shadow: none;
  border-top: none;
  border-right: none;
  border-left: none;
  border-image: initial;
  border-radius: 0px;
  border-bottom: 1px solid rgb(221, 221, 221);
  color: rgb(85, 85, 85);
  width: 100%;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 26px;
`;
const EmailInput = styled.div`
  margin-top: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
`;
const Email = styled.input`
  color: rgb(85, 85, 85);
  outline: none; /* Remove the outline (focus indicator) */
  margin-bottom: 1rem;
   border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid rgb(221, 221, 221);
  padding:5px;
`;
const EditIcon = styled.div`
  cursor: pointer;
  user-select: none;
  margin-left: 10px;
`;
const ButtonGroup = styled.div`
  padding: 14px 20px;
  text-align: right;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: rgb(239, 239, 239);
`
const CancelButton = styled.button`    
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.9;
  font-size: 14px;
  padding: 8px 12px;
  min-width: 70px;
  display: inline-block;
  margin-right: 14px;
  background: none;
  border: none;
  color: rgb(136, 136, 136);
  font-weight: bold;
  box-shadow: none;
`
const SaveButton = styled.button`
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 2px;
  color: white;
  opacity: 0.9;
  font-size: 14px;
  padding: 8px 12px;
  min-width: 70px;
  background-color: rgb(34, 34, 34);
  border: 2px solid rgb(34, 34, 34);
  display: inline-block;
`

export default Account;
