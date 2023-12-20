import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  UserSliceActions,
  fetchUserData,
  logoutUser,
} from '../store/UserSlice';

import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import generateAndSetNewTokens from '../helper/generateAndSetNewTokens';
// import Account from './Account';

const Header = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState<boolean>(
    localStorage.getItem('access_token') !== null
  );
  const [openAccount, setOpenAccount] = useState<boolean>(false);
  const [dropClick, setDropClick] = useState<boolean>(false);

  const user = useSelector((state: any) => state.user);
  const { userId, image } = user

  const dropdownRef: any = useRef(null);
  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropClick(false);
    }
  };
  //Fetching user details
  useEffect(() => {
    const fetchUserDataFunction = async () => {
      //@ts-ignore
      const response = await dispatch(fetchUserData());

      if (response.payload === 'token expired') {
        try {
          await generateAndSetNewTokens();

          //@ts-ignore
          dispatch(fetchUserData());
        } catch (error: any) {
          if (error && error.response.status === 403) {
            localStorage.removeItem('access_token');
            alert('unauthenticated : Token expired');
          } else console.log(error);
        }
      } else {
        if (response?.error) {
          alert("Unauthorized Access: Your credentials are invalid or expired. Please log in again")
        }
      }
    };
    if (localStorage.getItem('access_token') !== null) fetchUserDataFunction();

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
  setLoggedIn(userId !== "")
  }, [user])

  const handleLoginOut = () => {
    if (!loggedIn) {
      navigate('/login');
    } else {
      dispatch(UserSliceActions.logout());
      //@ts-ignore
      dispatch(logoutUser());
      setLoggedIn(false);
      window.location.reload();
    }
  };
  return (
    <HeaderWrapper>
      <HeaderContent>
        <Logo>Pomo</Logo>
        <Buttons>
          <Icon
            data-testid='open-ana-page-button'
            onClick={() => setOpen(true)}
            $fsize={12}
            $border='1px solid rgba(255,255,255,0.5)'
            $font='sans-serif'
            $p='0 10px'
            $bg={true}
          >
            Analytics
          </Icon>
          {!loggedIn && (
            <Icon
              data-testid='open-ana-page-button'
              onClick={() => handleLoginOut()}
              $fsize={12}
              $border='1px solid rgba(255,255,255,0.5)'
              $font='sans-serif'
              $p='0 10px'
              $bg={true}
            >
              <AccountCircleIcon style={{ width: '35px' }} />
              <Text>Login</Text>
            </Icon>
          )}
          {loggedIn && (
            <Main onClick={() => setDropClick(!dropClick)}>
              <DP ref={dropdownRef}>
                {image !== '' ? (
                  <Image src={image} />
                ) : (
                  <Image
                    src='https://pomofocus.io/icons/user-big-black.png'
                    style={{
                      width: '42px',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                    }}
                  />
                )}
              </DP>
              {dropClick && (
                <DropdownWrapper>
                  <DropItems onClick={() => setOpenAccount(!openAccount)}>
                    <PersonIcon
                      style={{
                        opacity: '0.8',
                        width: '24px',
                        marginRight: '8px',
                      }}
                    />
                    Account
                  </DropItems>
                  <DropItems onClick={() => handleLoginOut()}>
                    <LogoutIcon
                      style={{
                        opacity: '0.8',
                        width: '24px',
                        marginRight: '8px',
                      }}
                    />{' '}
                    Logout
                  </DropItems>
                  <DivideLine />
                  <DropItems>
                    <DeleteForeverIcon
                      style={{
                        opacity: '0.8',
                        width: '24px',
                        marginRight: '8px',
                      }}
                    />{' '}
                    Delete Account
                  </DropItems>
                </DropdownWrapper>
              )}
            </Main>
          )}
        </Buttons>
      </HeaderContent>
      {/* {openAccount && (
        <AccountWrapper>
          <Account />
        </AccountWrapper>
      )} */}
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const HeaderContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: white;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  margin: 0 5px;
  font-size: 40px;
  letter-spacing: 2px;
  font-family: Comic neue;
  cursor: pointer;
`;
const Icon = styled.div<{
  $fsize: number;
  $border: string;
  $font: string;
  $p: string;
  $bg: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.9;
  background: none rgba(255, 255, 255, 0.2);
  margin-left: 10px;
  font-size: 13px;
  padding: 8px 16px 8px 12px;
  min-width: 70px;
  border: none;
  color: white !important;
  font-family: Roboto;
  font-size: 14px;
  letter-spacing: 1.5px;

  &:hover {
    opacity: 1;
  }
`;
const Buttons = styled.div`
  display: flex;
`;
const DP = styled.div`
  margin-left: 8px;
  padding: 2px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
`;
const Image = styled.img`
  width: 40px;
  border-radius: 4px;
  background-color: white;
`;
const Main = styled.div`
  position: relative;
`;
const DropdownWrapper = styled.div`
  border-radius: 4px;
  opacity: 1;
  padding: 4px 0px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 10px 20px, rgba(0, 0, 0, 0.1) 0px 3px 6px;
  display: block;
  pointer-events: auto;
  position: absolute;
  background-color: white;
  transform: translateY(10px);
  width: 200px;
  right: 0px;
  font-family: 'Roboto', sans-serif;
  z-index: 100;
`;
const DropItems = styled.div`
  color: rgb(79, 43, 45);
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;
const DivideLine = styled.div`
  height: 1px;
  width: 85%;
  background-color: rgb(239, 239, 239);
  margin: auto;
`;
const Text = styled.div`
  display: block;
  margin-left: 2px;
`;
// const AccountWrapper = styled.div`
//   z-index: 1000;
// `;
export default Header;
