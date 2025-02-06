import React, { useState } from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Grid } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UserOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const screens = Grid.useBreakpoint(); // 현재 브레이크포인트 상태를 가져옴

  const handleMenuToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 사이드바 설정 */}
      <Sider
        collapsible
        collapsed={collapsed}
        breakpoint="lg" // 화면 크기가 'lg' 이하일 때 사이드바가 숨겨짐
        collapsedWidth="0" // 사이드바가 축소되었을 때의 너비
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        trigger={null} // 사이드바의 기본 햄버거 버튼을 제거
        style={{
          position: "fixed", // 사이드바를 화면에 고정
          top: 0,
          left: 0,
          height: "100vh", // 화면 전체를 덮도록 설정
          zIndex: 100, // 콘텐츠 위로 올리기 위한 z-index
          transition: "transform 0.3s ease", // 애니메이션 효과
          transform: collapsed ? "translateX(-100%)" : "translateX(0)", // 사이드바 애니메이션
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items}
        />
      </Sider>
      <Layout
        style={{
          // 'xl' 이상일 때만 marginLeft를 설정
          marginLeft: screens.xl ? (collapsed ? 0 : 200) : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* 헤더 설정 */}
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "flex-end", // 오른쪽 정렬
            alignItems: "center",
            zIndex: 10, // 헤더는 사이드바보다 아래로 위치하도록 설정
          }}
        >
          {/* 사이드바 토글 버튼 */}
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={handleMenuToggle}
            style={{ marginLeft: "auto" }} // 버튼을 오른쪽으로 정렬
          />
        </Header>
        {/* 콘텐츠 영역 */}
        <Content
          style={{
            margin: "10px 16px 0",
            height: "calc(100vh - 64px)", // 콘텐츠가 화면을 꽉 차게 하기 (Header 높이 제외)
            paddingTop: 64, // 헤더가 위에 고정되도록 공간 확보
            transition: "margin-left 0.3s ease", // 사이드바가 펼쳐질 때 콘텐츠가 밀리지 않도록 애니메이션
            overflow: "auto", // 콘텐츠가 넘칠 때 스크롤이 생기도록 설정
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 560,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            content
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
