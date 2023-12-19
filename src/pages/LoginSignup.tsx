import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../types';
import styled from 'styled-components';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { fetchUserData } from '../store/UserSlice';

const LoginSignup = () => {
    const baseURL = 'https://pomo-backend.onrender.com/api';
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedIntervalColor = useSelector(
    (state: RootState) => state.interval.interval.color
  );

  const [isLogIn, setIsLogIn] = useState(currentPath === '/login');
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const { email, password, username } = userData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (password.length < 8) {
      alert('Min. password length is 8');
    } else {
      if (currentPath === '/login') {
        try {
          const response = await axios.post(`${baseURL}/auth/login`, {
            email,
            password,
          });
          localStorage.setItem('access_token', response.data.accessToken);
          //@ts-ignore
          dispatch(fetchUserData());
          navigate('/');
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const response = await axios.post(`${baseURL}/auth/signup`, {
            username,
            email,
            password,
          });
          localStorage.setItem('access_token', response.data.accessToken);
          //@ts-ignore
          dispatch(fetchUserData());
          navigate('/');
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  const handleChangePage = () => {
    setIsLogIn(!isLogIn);

    navigate(currentPath === '/login' ? '/signup' : '/login');
  };
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            withCredentials: false,
          }
        );
        const picture = res.data.picture;
        const username = res.data.name;
        const email = res.data.email;
        const password = res.data.sub;

         const response = await axios.post(`${baseURL}/auth/googleSignUp`, {
          picture,
          username,
          email,
          password,
        });
        localStorage.setItem('access_token', response.data.accessToken);
        //@ts-ignore
        dispatch(fetchUserData());
        navigate('/');
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Section $selectedIntervalColor={selectedIntervalColor}>
      <Icon
        onClick={() => navigate('/')}
        $fsize={40}
        $font="Comic neue"
        $color={selectedIntervalColor}
      >
        Pomo
      </Icon>
      <Heading>{!isLogIn ? 'Create Account ' : 'Login'}</Heading>
      <AuthWrapper>
        {/* LogIn with Google */}
        <GoogleLoginButtonWrap>
          <GoogleLoginButton onClick={() => login()}>
            <img
              style={{
                width: '18px',
                marginRight: '8px',
              }}
              src="https://pomofocus.io/icons/g-logo.png"
              alt="google logo"
            />
            <Text>{!isLogIn ? 'Signup with Google' : 'Login with Google'}</Text>
          </GoogleLoginButton>
        </GoogleLoginButtonWrap>
        {/* LogIn with Google */}

        {/* OR */}
        <ORWrap>
          <LineWrap>
            <Line />
          </LineWrap>
          <OR>or</OR>
          <LineWrap>
            <Line />
          </LineWrap>
        </ORWrap>
        {/* OR */}

        {/* Login Form */}
        <LoginForm onSubmit={(e: any) => handleSubmit(e)}>
          {!isLogIn && (
            <LabelInput>
              <Label>USERNAME</Label>
              <Input
                name="username"
                type="username"
                placeholder="example"
                value={username}
                onChange={handleChange}
              ></Input>
            </LabelInput>
          )}
          <LabelInput>
            <Label>EMAIL</Label>
            <Input
              name="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={handleChange}
            ></Input>
          </LabelInput>
          <LabelInput>
            <Label>PASSWORD</Label>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
            ></Input>
          </LabelInput>
          <LoginSignupButtonWrap>
            <LoginSignupButton type="submit">
              {!isLogIn ? 'Signup' : 'Login'}
            </LoginSignupButton>
          </LoginSignupButtonWrap>
          {isLogIn && <ForgotPass>Forgot Password</ForgotPass>}
        </LoginForm>
        {/* Login Form */}
      </AuthWrapper>
      <CreateAccountWrap>
        <Text2>
          {!isLogIn ? 'Already have an account?' : "Don't have an account?"}
        </Text2>
        <CreateAcc onClick={() => handleChangePage()}>
          {!isLogIn ? 'Log In' : 'Create Account'}
        </CreateAcc>
      </CreateAccountWrap>
    </Section>
  );
};

const Section = styled.div<{ $selectedIntervalColor?: string }>`
  position: relative;
  height: 100vh;
  background: ${(props) => props.$selectedIntervalColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Rubik', sans-serif;
`;
const Heading = styled.div`
  color: white;
  font-size: 20px;
  margin-bottom: 20px;
`;
const AuthWrapper = styled.div`
  padding: 8px 18px 22px;
  background: white;
  height: auto;
  width: 314px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;
const GoogleLoginButtonWrap = styled.div`
  width: 314px;
  height: 44px;
  margin-top: 18px;
`;
const GoogleLoginButton = styled.button`
  width: 100%;
  height: 100%;
  border: 1px solid rgb(238, 238, 238);
  background: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:active {
    transform: translateY(2px);
    box-shadow: none;
  }
`;
const Text = styled.div`
  color: gray;
  font-size: 15px;
  font-weight: bold;
`;
const ORWrap = styled.div`
  display: flex;
  align-content: center;
  margin: 18px 0 2px;
  justify-content: space-between;
`;
const LineWrap = styled.div`
  display: flex;
  align-items: center;
`;
const Line = styled.div`
  height: 0;
  border: 1px solid rgb(238, 238, 238);
  width: 131px;
`;
const OR = styled.p`
  color: rgba(0, 0, 0, 0.2);
  font-weight: 300;
`;
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const LabelInput = styled.div`
  display: flex;
  flex-direction: column;
`;
const Label = styled.p`
  color: rgb(196, 196, 196);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 8px;
`;
const Input = styled.input`
  border-radius: 4px;
  background-color: rgb(239, 239, 239);
  font-size: 16px;
  padding: 12px 10px;
  border: none;
  width: 100%;
  box-sizing: border-box;
  &::placeholder {
    color: rgb(196, 196, 196);
  }
`;
const LoginSignupButtonWrap = styled.div`
  margin-top: 28px;
`;
const LoginSignupButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 2px;
  color: white;
  opacity: 0.9;
  font-size: 14px;
  padding: 12px;
  min-width: 70px;
  background: rgb(34, 34, 34);
  border: 2px solid rgb(34, 34, 34);
  width: 100%;
`;
const ForgotPass = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.9;
  font-size: 14px;
  background: none;
  border: none;
  box-shadow: none;
  color: rgba(0, 0, 0, 0.4);
  font-weight: bold;
  letter-spacing: 0.02em;
  text-decoration: underline;
`;
const CreateAccountWrap = styled.div`
  margin-top: 24px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
const Text2 = styled.p`
  font-size: 16px;
  margin-bottom: 7px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
`;
const CreateAcc = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  opacity: 0.9;
  font-size: 14px;
  background: none;
  border: none;
  box-shadow: none;
  font-weight: bold;
  color: white;
  letter-spacing: 0.02em;
  text-decoration: underline;
`;
const Icon = styled.div<{
  $fsize: number;
  $font: string;
  $color: string;
}>`
  margin-bottom: 50px;
  font-size: ${(props) => props.$fsize}px;
  letter-spacing: 2px;
  font-family: ${(props) => props.$font};
  color: ${(props) => props.$color};
  background: white;
  padding: 20px;
  border-radius: 100%;
  cursor: pointer;
`;

export default LoginSignup;
