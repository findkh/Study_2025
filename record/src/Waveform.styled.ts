import styled from "styled-components";

export const WaveformContianer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  background: transparent;
  gap: 2rem;
`;

export const Wave = styled.div`
  width: 100%;
  height: 90px;
`;

export const StyledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #fe6e00;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f76c2f;
  }

  &:active {
    background-color: #e65b1a;
  }

  &:disabled {
    background-color: #d3d3d3;
    cursor: not-allowed;
  }
`;

export const UploadDiv = styled.div`
  width: 100%;
`;
