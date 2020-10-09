import styled from 'styled-components';

export const Loader = styled.div`
  font-size: 2em;
  color: #ffffff;
  margin: auto;
`;

export const Page = styled.div`
  background-color: #0c0c0c;
  width: 100%;
  text-align: center;
`;

export const PageContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

export const BoardColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BoardColumnTitle = styled.div`
  color: #ffffff;
  font-size: 1.5em;
  text-transform: capitalize;
  width: 120px;
  height: 90px;
  @media (max-width: 800px) {
    font-size: 0.5em;
    width: 45px;
    height: 30px;
  }
`;

export const ClueButton = styled.button`
  width: 120px;
  height: 90px;
  padding: 20px;
  margin: 5px;
  background-color: ${(props) => props.visited ? '#5f678e' : '#0321b3'};
  font-size: 2em;
  color: #f5ab00;
  font-weight: bold;
  @media (max-width: 800px) {
    width: 45px;
    height: 30px;
    padding: 10px;
    font-size: 0.5em;
    margin: 5px;
  }
`;

export const ClueDDButton = styled(ClueButton)`
  font-size: 0.5em;
`;

export const Overlay = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 0;
  right: 0;
  margin: auto;
`;

export const ClueDetails = styled(Overlay)`
  background-color: #051282;
`;

export const ClueText = styled.div`
  display: flex;
  flex: 1;
  font-size: 3em;
  margin-top: 10%;
  align-items: center;
  text-align: center;
  padding: 15px;
  color: #ffffff;
  @media (max-width: 800px) {
    font-size: 1.5em;
  }
`;

export const ResetConfirmation = styled(Overlay)`
  background-color: #051282;
`;

export const ClueDetailButtonsWrapper = styled.div`
  display: flex;
  padding: 20px;
`;

export const ClueDetailsButton = styled.button`
  width: 220px;
  height: 80px;
  padding: 20px;
  border: 0;
  font-size: 1.5em;
  margin: 20px;
  @media (max-width: 800px) {
    width: 120px;
    height: 40px;
    font-size: 1em;
    padding: 0;
    margin: 5px;
  }
`;

export const ClueDetailsShowButton = styled(ClueDetailsButton)`
  background-color: #f5ab00;
`;
export const ClueDetailsDoneButton = styled(ClueDetailsButton)`
  background-color: #f56500;
`;

export const ResetButton = styled(ClueDetailsButton)`
  margin-top: 40px;
  background-color: #f56500;
  border-radius: 10px;
`;
