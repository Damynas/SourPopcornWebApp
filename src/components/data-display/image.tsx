import { Box } from '@mui/material';

const defaultHeight = 400;
const defaultWidth = 400;

const Image = (props: IImageProps) => {
  const {
    src,
    height = defaultHeight,
    width = defaultWidth,
    margin,
    padding
  } = props;
  return (
    <Box
      component='img'
      sx={{
        objectFit: 'contain',
        maxHeight: { height },
        maxWidth: { width }
      }}
      margin={margin}
      padding={padding}
      src={src}
    />
  );
};

interface IImageProps {
  src: string;
  height?: number;
  width?: number;
  margin?: number;
  padding?: number;
}

export default Image;
