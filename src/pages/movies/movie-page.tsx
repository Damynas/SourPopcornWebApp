import { type ChangeEvent, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography, styled } from '@mui/material';
import { Button, Image, Page, RatingField, TextField } from '../../components';
import { HttpStatus, PageName } from '../../constants';
import PopcornImage from '../../assets/images/popcorn.png';
import {
  DataContext,
  useFind,
  type IDataContext,
  formatDate,
  useSave
} from '../../utils';
import {
  type IFormValue,
  type IMovieDto,
  type IApiErrorResponse
} from '../../common';
import Pluralize from 'pluralize';
import Rating from './rating';

const Container = styled(Box)(({ theme }) => ({
  backgroundColor: theme.sour.colors.grey.dark
}));

const TitleText = styled(Typography)(({ theme }) => ({
  color: theme.sour.colors.purple.main,
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  textDecoration: 'none'
}));

const Text = styled(Typography)(({ theme }) => ({
  color: theme.sour.colors.purple.main,
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.2rem',
  textDecoration: 'none'
}));

const initialForm = {
  sourPopcorns: {
    value: '',
    errorMessage: ''
  },
  comment: {
    value: '',
    errorMessage: ''
  }
};

const MoviePage = () => {
  const { id } = useParams();

  const { apiData, user, openSnackbar } = useContext(
    DataContext
  ) as IDataContext;

  const [movie, setMovie] = useState<IMovieDto | null>(null);

  const [form, setForm] = useState<Record<string, IFormValue>>(initialForm);

  const handleChange = (propertyName: string, propertyValue: string): void => {
    setForm({
      ...form,
      [propertyName]: {
        value: propertyValue,
        errorMessage: ''
      }
    });
  };

  const {
    find: getMovie,
    loading: getMovieLoading,
    response: getMovieResponse,
    error: getMovieError,
    clearResponse: clearGetMovieResponse,
    clearError: clearGetMovieError
  } = useFind(`${apiData.apiUrl}/movies/${id}`);

  const saveRating = useSave(`${apiData.apiUrl}/movies/${id}/ratings`);

  useEffect(() => {
    getMovie(apiData.requestConfig);
  }, [apiData.requestConfig, getMovie]);

  if (getMovieResponse) {
    if (getMovieResponse.status === HttpStatus.OK) {
      const movie = getMovieResponse.data.resource;
      setMovie(movie);
    }
    clearGetMovieResponse();
  }

  if (getMovieError) {
    if (getMovieError.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (getMovieError.response?.status === HttpStatus.NOT_FOUND) {
      openSnackbar('Movie Not Found', 'error');
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    clearGetMovieError();
  }

  const mapApiErrors = (errors: IApiErrorResponse[]) => {
    let updatedForm = form;
    errors.forEach((error) => {
      updatedForm = {
        ...updatedForm,
        [error.propertyName.toLowerCase()]: {
          ...updatedForm[error.propertyName.toLowerCase()],
          errorMessage: error.value
        }
      };
    });
    setForm(updatedForm);
  };

  const handleRateButtonClick = () => {
    if (!checkForErrors()) {
      const request = {
        sourPopcorns: form.sourPopcorns.value,
        comment: form.comment.value
      };
      saveRating.save(request, apiData.requestConfig);
    }
  };

  if (saveRating.response) {
    if (saveRating.response.status === HttpStatus.CREATED_AT_ROUTE) {
      setForm(initialForm);
      getMovie(apiData.requestConfig);
      openSnackbar('Rating Created Successfully');
    }
    saveRating.clearResponse();
  }

  if (saveRating.error) {
    if (saveRating.error.response?.status === HttpStatus.UNAUTHORIZED) {
      openSnackbar('Unauthorized. Please reload and try again.', 'error');
    } else if (
      saveRating.error.response?.status === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      mapApiErrors(saveRating.error.response.data as IApiErrorResponse[]);
    } else {
      openSnackbar('Unexpected Error', 'error');
    }
    saveRating.clearError();
  }

  const checkForErrors = () => {
    let hasErrors = false;
    const validationErrors = [];

    if (!form.sourPopcorns.value) {
      validationErrors.push({
        propertyName: 'sourPopcorns',
        errorMessage: 'Required'
      });
    } else if (
      parseInt(form.sourPopcorns.value) < 0 ||
      parseInt(form.sourPopcorns.value) > 5
    ) {
      validationErrors.push({
        propertyName: 'sourPopcorns',
        errorMessage: `SourPopcorns must be an integer from 0 to 5.`
      });
    }

    if (!form.comment.value) {
      validationErrors.push({
        propertyName: 'comment',
        errorMessage: 'Required'
      });
    } else if (form.comment.value.length > 200) {
      validationErrors.push({
        propertyName: 'comment',
        errorMessage: `Movie's comment cannot exceed 200 characters.`
      });
    }

    if (validationErrors.length !== 0) {
      let updatedForm = form;
      validationErrors.forEach((validationError) => {
        updatedForm = {
          ...updatedForm,
          [validationError.propertyName]: {
            ...updatedForm[validationError.propertyName],
            errorMessage: validationError.errorMessage
          }
        };
      });
      setForm(updatedForm);
      hasErrors = true;
    }

    return hasErrors;
  };

  return (
    <Page
      authenticated
      selectedPage={PageName.MOVIES}
      loading={getMovieLoading}
    >
      <Stack direction='column' width='80%' margin='5rem' spacing={3}>
        <Container
          height='1rem'
          display='flex'
          alignItems='center'
          padding='1rem'
        >
          <TitleText variant='h5'>{movie?.title.toUpperCase()}</TitleText>
        </Container>
        <Stack direction='row' spacing={5}>
          <Container width='20rem' padding='0.75rem'>
            <Image
              src={movie?.posterLink || PopcornImage}
              height={300}
              width={300}
            />
          </Container>
          <Container width='100%' padding='1rem'>
            <Stack direction='column' spacing={1.75}>
              <Text>Description: {movie?.description}</Text>
              <Text>Director: {movie?.director?.name}</Text>
              <Text>Country: {movie?.country}</Text>
              <Text>Language: {movie?.language}</Text>
              <Text>Released On: {formatDate(movie?.releasedOn || '')}</Text>
              <Text>Writers: {movie?.writers.join(', ')}</Text>
              <Text>Actors: {movie?.actors.join(', ')}</Text>
              <Text>
                Rating: {Pluralize('Sour Popcorn', movie?.sourPopcorns, true)}
              </Text>
            </Stack>
          </Container>
        </Stack>
        <Container maxHeight='100%' overflow='auto'>
          <Stack
            direction='column'
            alignItems='flex-start'
            spacing={1.5}
            padding='0.5rem'
          >
            <Stack direction='column' width='100%'>
              {movie?.ratings?.map((rating) => (
                <Rating
                  rating={rating}
                  reloadMovie={() => getMovie(apiData.requestConfig)}
                />
              ))}
            </Stack>
            {user?.userId &&
              !movie?.ratings
                ?.map((rating) => rating.creatorId)
                .includes(user.userId) && (
                <>
                  <RatingField
                    name='sourPopcorns'
                    value={parseInt(form.sourPopcorns.value)}
                    onClick={handleChange}
                    errorMessage={form.sourPopcorns.errorMessage}
                  />
                  <TextField
                    label='Comment'
                    name='comment'
                    required
                    multiline
                    rows={3}
                    value={form.comment.value}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleChange(event.target.name, event.target.value)
                    }
                    error={form.comment.errorMessage !== ''}
                    helperText={form.comment.errorMessage}
                  />
                  <Button
                    variant='outlined'
                    onClick={handleRateButtonClick}
                    loading={saveRating.loading}
                  >
                    Rate
                  </Button>
                </>
              )}
          </Stack>
        </Container>
      </Stack>
    </Page>
  );
};

export default MoviePage;
