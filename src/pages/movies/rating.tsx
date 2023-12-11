import { useContext } from 'react';
import { Stack, Typography, styled } from '@mui/material';
import { type IRatingDto } from '../../common';
import { IconButton } from '../../components';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  DataContext,
  useSave,
  type IDataContext,
  useUpdate
} from '../../utils';
import { HttpStatus } from '../../constants';

const Container = styled(Stack)(({ theme }) => ({
  borderBottom: `0.1rem solid ${theme.sour.colors.purple.main}`
}));

const Text = styled(Typography)(({ theme }) => ({
  color: theme.sour.colors.purple.main,
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.2rem',
  textDecoration: 'none'
}));

const Rating = (props: IRatingProps) => {
  const { rating, reloadMovie } = props;

  const { apiData, user, openSnackbar } = useContext(
    DataContext
  ) as IDataContext;

  const saveVote = useSave(
    `${apiData.apiUrl}/movies/${rating.movieId}/ratings/${rating.id}/votes`
  );
  const updateVote = useUpdate(
    `${apiData.apiUrl}/movies/${rating.movieId}/ratings/${rating.id}/votes/{id}`
  );

  const handleClick = (isPositive: boolean) => {
    const request = {
      isPositive: isPositive
    };
    if (
      user?.userId &&
      rating.votes?.map((vote) => vote.creatorId).includes(user.userId)
    ) {
      const voteId = rating.votes.find(
        (vote) => vote.creatorId === user?.userId
      )?.id;
      if (voteId) {
        const additionalURLParams = [
          {
            name: 'id',
            value: voteId
          }
        ];
        updateVote.update(request, apiData.requestConfig, additionalURLParams);
      }
    } else {
      saveVote.save(request, apiData.requestConfig);
    }
  };

  if (saveVote.response) {
    if (saveVote.response.status === HttpStatus.CREATED_AT_ROUTE) {
      reloadMovie();
    }
    saveVote.clearResponse();
  }

  if (saveVote.error) {
    if (saveVote.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    saveVote.clearError();
  }

  if (updateVote.response) {
    if (updateVote.response.status === HttpStatus.OK) {
      reloadMovie();
    }
    updateVote.clearResponse();
  }

  if (updateVote.error) {
    if (updateVote.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    updateVote.clearError();
  }

  const voteButtonDisabled = (isPositive: boolean) => {
    if (saveVote.loading || !user?.userId) {
      return true;
    }

    return (
      rating.creatorId === user.userId ||
      (rating.votes || []).some(
        (vote) =>
          vote.isPositive === isPositive && vote.creatorId === user.userId
      )
    );
  };

  return (
    <Container direction='column' padding='0.5rem'>
      <Stack
        direction='row'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        margin='0.5rem'
      >
        <Text>Sour Popcorns: {rating.sourPopcorns}</Text>
        <Stack direction='row' spacing={2}>
          <IconButton
            onClick={() => handleClick(true)}
            overlayText={rating.votes
              ?.filter((vote) => vote.isPositive)
              .length.toString()}
            disabled={voteButtonDisabled(true)}
          >
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton
            onClick={() => handleClick(false)}
            overlayText={rating.votes
              ?.filter((vote) => !vote.isPositive)
              .length.toString()}
            disabled={voteButtonDisabled(false)}
          >
            <ArrowDownwardIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Text paddingLeft='2rem'>{rating.comment}</Text>
    </Container>
  );
};

interface IRatingProps {
  rating: IRatingDto;
  reloadMovie: () => void;
}

export default Rating;
