import { Box } from '@mui/material';

const defaultHeight = 400;
const defaultWidth = 400;

const Image = (props: IImageProps) => {
  const { src, height = defaultHeight, width = defaultWidth } = props;
  return (
    <Box
      component='img'
      sx={{
        height: height,
        width: width,
        maxHeight: { xs: defaultHeight / 2, md: defaultHeight },
        maxWidth: { xs: defaultWidth / 2, md: defaultWidth }
      }}
      src={src}
    />
  );
};

interface IImageProps {
  src: string;
  height?: number;
  width?: number;
}

export default Image;
