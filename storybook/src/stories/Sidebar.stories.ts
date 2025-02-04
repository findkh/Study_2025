import type { Meta, StoryObj } from "@storybook/react";
import Sidebar from "../components/sidebar/Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "TEST/Sidebar",
  component: Sidebar,
  // tags: ["autodocs"], // 자동 문서화 활성화
  parameters: {
    docs: {
      description: {
        component: "Ant Design의 `Menu`를 활용하여 반응형 사이드바를 구현.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};
