import React from "react";
import { Row, Col, Typography } from "antd";
import VoiceRecorder from "./VoiceRecorder";

const { Text } = Typography;

const MicComponent: React.FC = () => {
  return (
    <Row style={{ height: "100%", border: "1px solid gray" }} align="middle" justify="center" gutter={[16, 16]}>
      <Col xs={24} md={12} style={{ textAlign: "center", padding: "0" }}>
        <VoiceRecorder />
      </Col>
      <Col
        xs={24}
        md={12}
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", padding: "0" }}
      >
        <Text style={{ textAlign: "center" }}>마이크 연결 후 녹음 버튼을 눌러 음성인식을 시작하세요</Text>
      </Col>
    </Row>
  );
};

export default MicComponent;
