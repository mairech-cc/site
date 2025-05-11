import { Meta, StoryObj } from "@storybook/react";
import Modal, { LoaderModal } from "./modal";
import { fn } from "@storybook/test";

const meta = {
  title: "View/Modal",
  component: Modal,
  argTypes: {
    title: { control: "text" },
    children: { control: "text" },
    shown: { control: "boolean" },
    size: { control: "select", options: ["auto", "50%", "70%", "max-content", "250px"] },
    animate: { control: "select", options: ["auto", "all", "none"] },
    allowEscape: { control: "boolean" },
    allowClickOutside: { control: "boolean" },
    withUi: { control: "boolean" },
    withCloseButton: { control: "boolean" },
  },
  args: {
    onClose: fn(),
  }
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    shown: true,
    title: "Titre",
    children: "Contenu",
    size: "250px",
  },
};

export const NoCloseButton: Story = {
  args: {
    shown: true,
    withCloseButton: false,
    title: "Titre",
    children: "Contenu",
    size: "250px",
  },
};

export const NoUI: Story = {
  args: {
    shown: true,
    withUi: false,
    withCloseButton: false,
    children: "Contenu",
    size: "max-content",
  },
};

export const Loader: Story = {
  render: ({ shown }) => <LoaderModal shown={shown} />,
  args: {
    shown: true,
  },
  argTypes: {
    shown: { type: "boolean" },
  },
};

