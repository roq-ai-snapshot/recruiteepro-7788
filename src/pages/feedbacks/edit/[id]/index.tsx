import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getFeedbackById, updateFeedbackById } from 'apiSdk/feedbacks';
import { Error } from 'components/error';
import { feedbackValidationSchema } from 'validationSchema/feedbacks';
import { FeedbackInterface } from 'interfaces/feedback';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { InterviewInterface } from 'interfaces/interview';
import { UserInterface } from 'interfaces/user';
import { getInterviews } from 'apiSdk/interviews';
import { getUsers } from 'apiSdk/users';

function FeedbackEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<FeedbackInterface>(
    () => (id ? `/feedbacks/${id}` : null),
    () => getFeedbackById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: FeedbackInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateFeedbackById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<FeedbackInterface>({
    initialValues: data,
    validationSchema: feedbackValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Feedback
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="comment" mb="4" isInvalid={!!formik.errors?.comment}>
              <FormLabel>Comment</FormLabel>
              <Input type="text" name="comment" value={formik.values?.comment} onChange={formik.handleChange} />
              {formik.errors.comment && <FormErrorMessage>{formik.errors?.comment}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<InterviewInterface>
              formik={formik}
              name={'interview_id'}
              label={'Select Interview'}
              placeholder={'Select Interview'}
              fetcher={getInterviews}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.job_application_id}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'feedback',
  operation: AccessOperationEnum.UPDATE,
})(FeedbackEditPage);
