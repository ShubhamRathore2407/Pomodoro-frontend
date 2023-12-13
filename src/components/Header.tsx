import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  UserSliceActions,
  fetchUserData,
  logoutUser,
} from '../store/UserSlice';
import axios from 'axios';

const Header = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState<boolean>(
    localStorage.getItem('access_token') !== null
  );
  const generateAndSetNewTokens = async () => {
    const reResponse = await axios.post(
      'http://localhost:5000/api/auth/refreshToken'
    );
    localStorage.removeItem('access_token');
    localStorage.setItem('access_token', reResponse.data.accessToken);
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
      }
    };
    fetchUserDataFunction();
  }, []);

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
        <Icon $fsize={40} $border="" $font="Comic neue" $p="0" $bg={false}>
          Pomo
        </Icon>
        <Buttons>
          <Icon
            data-testid="open-ana-page-button"
            onClick={() => setOpen(true)}
            $fsize={12}
            $border="1px solid rgba(255,255,255,0.5)"
            $font="sans-serif"
            $p="0 10px"
            $bg={true}
          >
            Analytics
          </Icon>
          <Icon
            data-testid="open-ana-page-button"
            onClick={() => handleLoginOut()}
            $fsize={12}
            $border="1px solid rgba(255,255,255,0.5)"
            $font="sans-serif"
            $p="0 10px"
            $bg={true}
          >
            {loggedIn ? 'Logout' : 'Login'}
          </Icon>
        </Buttons>
      </HeaderContent>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: white;
`;
const HeaderContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
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
  margin: 0 5px;
  font-size: ${(props) => props.$fsize}px;
  border: ${(props) => props.$border};
  letter-spacing: 2px;
  font-family: ${(props) => props.$font};
  padding: ${(props) => props.$p};
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.$bg ? 'rgba(255,255,255,0.1)' : '')};
  }
`;
const Buttons = styled.div`
  display: flex;
`;

export default Header;
