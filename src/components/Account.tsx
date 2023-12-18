import styled from 'styled-components';
import CreateIcon from '@mui/icons-material/Create';

const Account = () => {
  return (
    <AccountWrapper>
      <AccountBox>
        <Box>
          <DetailsWrapper>
            <AccountTitle>Account</AccountTitle>
            <Details>
              <PictureWrapper>
                <PictureWrap>
                  <Picture src="" alt="User image" />
                </PictureWrap>
              </PictureWrapper>
              <InputDetails>
                <UsernameInput type="text" placeholder="test" />
                <EmailInput>
                  <Email>test@test.com</Email>
                  <EditIcon>
                    <CreateIcon style={{ width: '16px', opacity: '0.5' }} />
                  </EditIcon>
                </EmailInput>
              </InputDetails>
            </Details>
          </DetailsWrapper>
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
`;
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
const Email = styled.div`
  color: rgb(85, 85, 85);
`;
const EditIcon = styled.div`
  cursor: pointer;
  user-select: none;
  margin-left: 10px;
`;

export default Account;
