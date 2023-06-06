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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createInterview } from 'apiSdk/interviews';
import { Error } from 'components/error';
import { interviewValidationSchema } from 'validationSchema/interviews';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { JobApplicationInterface } from 'interfaces/job-application';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { getJobApplications } from 'apiSdk/job-applications';
import { InterviewInterface } from 'interfaces/interview';

function InterviewCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: InterviewInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createInterview(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InterviewInterface>({
    initialValues: {
      date_time: new Date(new Date().toDateString()),
      job_application_id: (router.query.job_application_id as string) ?? null,
      interviewer_id: (router.query.interviewer_id as string) ?? null,
      feedback: [],
    },
    validationSchema: interviewValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Interview
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="date_time" mb="4">
            <FormLabel>Date Time</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.date_time}
              onChange={(value: Date) => formik.setFieldValue('date_time', value)}
            />
          </FormControl>
          <AsyncSelect<JobApplicationInterface>
            formik={formik}
            name={'job_application_id'}
            label={'Select Job Application'}
            placeholder={'Select Job Application'}
            fetcher={getJobApplications}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.job_posting_id}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'interviewer_id'}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'interview',
  operation: AccessOperationEnum.CREATE,
})(InterviewCreatePage);
