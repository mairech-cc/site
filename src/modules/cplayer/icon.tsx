import CIconSvg from "../../assets/icons/c.svg?react";
import HIconSvg from "../../assets/icons/h.svg?react";
import CppIconSvg from "../../assets/icons/cpp.svg?react";
import HppIconSvg from "../../assets/icons/hpp.svg?react";
import FileIconSvg from "../../assets/icons/file.svg?react";
import path from "path-browserify";
import { memo } from "react";

export const FileIcon = memo(({ name }: {
  name: string;
}) => {
  const ext = path.extname(name);

  switch (ext) {
    case ".c": {
      return <CIconSvg />
    }

    case ".h": {
      return <HIconSvg />
    }

    case ".cpp": {
      return <CppIconSvg />
    }

    case ".hpp": {
      return <HppIconSvg />
    }

    default: {
      return <FileIconSvg />
    }
  }
});
