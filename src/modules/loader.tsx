import { keyframes } from "@emotion/react";
import { Icon, IconLoader2, IconProps } from "@tabler/icons-react";

const animation = keyframes({
  from: {
    transform: "rotate(0)",
  },
  to: {
    transform: "rotate(1turn)",
  }
})

export default function IconLoader(props: IconProps & React.RefAttributes<Icon>) {
  return (
    <IconLoader2
      {...props}
      css={{ animation: `${animation} .6s linear infinite` }}
    />
  )
}
